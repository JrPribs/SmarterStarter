import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal
} from '@angular/core';
import {
  Auth, linkWithCredential, sendSignInLinkToEmail, signInWithEmailLink
} from '@angular/fire/auth';
import {
  AbstractControl, FormBuilder, ReactiveFormsModule, Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { UntilDestroy } from '@ngneat/until-destroy';

import { FacebookAuthButtonComponent } from '../../components/facebook-auth-button/facebook-auth-button.component';
import { GoogleAuthButtonComponent } from '../../components/google-auth-button/google-auth-button.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { LocalStorage } from 'src/app/core/local-storage';
import { HttpClient } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { filter } from 'rxjs/operators';
import { AuthService } from '~auth/auth.service';
import { firstValueFrom } from 'rxjs';
import { AuthStore } from '~auth/state/auth.store';

@UntilDestroy()
@Component({
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.scss' ],
  standalone: true,
  imports: [
    CommonModule,
    GoogleAuthButtonComponent,
    FacebookAuthButtonComponent,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule
  ],
  host: { ngSkipHydration: 'true' }, // eslint-disable-line @angular-eslint/no-host-metadata-property
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {

  private auth = inject(Auth);
  authStore = inject(AuthStore);
  private authSvc = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private localStorage = inject(LocalStorage);
  private router = inject(Router);
  private toast = inject(HotToastService);
  private route = inject(ActivatedRoute);

  dialogRef = inject(MatDialogRef, { optional: true });

  emailLoginForm = this.fb.group({
    email: [ '', [ Validators.required, Validators.email ] ],
    rememberMe: false
  });

  emailCtrl!: AbstractControl | null;
  rememberMeCtrl!: AbstractControl | null;

  emailLinkSent = false;
  emailMissing = false;
  errorCount = 0;
  fromEmailLink = false;
  loadingLogin = signal(false);
  isDialog = false;
  redirect!: string | null;

  authType = computed(() => this.authStore.authAccountLink() ? 'Link' : 'Login');

  isFacebookLink = computed(() => this.authStore.providerToLink()?.providerId === 'facebook.com');

  isGoogleLink = computed(() => this.authStore.providerToLink()?.providerId === 'google.com');

  isEmailLink = computed(() => this.authStore.providerToLink()?.providerId === 'email');

  ngOnInit(): void {
    this.redirect = this.localStorage.getItem('redirect');
    this.fromEmailLink = this.route.snapshot?.queryParams?.['loginWithEmailLink'];

    if (this.fromEmailLink) {
      this.loadingLogin.set(true);
    }

    this.emailCtrl = this.emailLoginForm.get('email');
    this.rememberMeCtrl = this.emailLoginForm.get('rememberMe');

    const email = this.localStorage.getItem('email');
    const rememberEmail = this.localStorage.getItem('rememberEmail');

    if (email) {
      this.emailLoginForm.patchValue({
        email,
        rememberMe: !!rememberEmail
      });

      if (this.fromEmailLink) {
        this.signInWithEmailLink(email);
      }
    } else if (this.fromEmailLink) {
      this.emailMissing = true;
      this.cdr.markForCheck();
    }
  }

  async getEmailLink(): Promise<any> {
    const email = this.emailCtrl?.value;

    if (!email) {
      this.toast.error('Email is required for passwordless signup');
      return false;
    }

    try {
      this.localStorage.setItem('email', email);

      if (this.rememberMeCtrl?.value) {
        this.localStorage.setItem('rememberEmail', 'true');
      } else {
        this.localStorage.removeItem('rememberEmail');
      }

      const actionCodeSettings = {
        url: window.location.href + '?loginWithEmailLink=true',
        handleCodeInApp: true
      };

      await sendSignInLinkToEmail(this.auth, email, actionCodeSettings);

      this.emailLinkSent = true;
      this.cdr.markForCheck();
    } catch (error: any) {
      const errorCode = error.code;
      console.debug('errorCode', errorCode);
      let errorMessage = 'There was an issue logging you in!';

      if (errorCode === 'auth/user-not-found') {
        errorMessage = 'User Not Found!';
      }

      this.toast.error(errorMessage);
    }

    return false;
  }

  async signInWithEmailLink(email?: string): Promise<any> {
    try {
      if (email && this.emailCtrl?.valid) {
        this.auth.config.authDomain = 'https://certifyndaba.com';
        const authResult = await signInWithEmailLink(this.auth, email, window.location.href);

        if (this.authStore.authAccountLink()) {
          await linkWithCredential(authResult.user, this.authStore.credentialToLink());
          this.toast.success('Account linked successfully!');
          this.authSvc.cancelAccountLinking();
        }
      } else {
        return false;
      }

      const claims = await firstValueFrom(this.authSvc.claims$.pipe(filter(claims => !!claims)));

      if (!this.rememberMeCtrl?.value) {
        this.localStorage.removeItem('email');
      }

      if (this.redirect) {
        this.localStorage.removeItem('redirect');
        return this.router.navigateByUrl(this.redirect);
      }

      if (this.isDialog) {
        return this.dialogRef?.close();
      }

      let redirectUrl = '/';

      if (claims?.role === 'admin') {
        redirectUrl = '/app/admin/verifications';
      } else if (claims?.accountType === 'candidate') {
        redirectUrl = '/app/candidate/profile';
      } else if (claims?.accountType === 'company') {
        redirectUrl = '/app/company/requests';
      }

      return this.router.navigateByUrl(redirectUrl);
    } catch (error: any) {
      const errorCode = error?.code;
      console.log('error', error);
      let errorMessage = 'There was an issue logging you in!';

      if (errorCode === 'auth/user-not-found') {
        errorMessage = 'User Not Found!';
      }

      this.toast.error(errorMessage);

      if (errorCode === 'auth/wrong-password' && this.errorCount >= 1) {
        this.toast.info('Perhaps you signed up with a social account under the same email?', { position: 'top-right' });
      }

      this.errorCount += 1;

      console.log('errorMessage', errorMessage);
    }
  }
}
