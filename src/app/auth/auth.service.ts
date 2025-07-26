import { HttpClient } from '@angular/common/http';
import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  Auth,
  AuthProvider,
  authState,
  IdTokenResult,
  linkWithCredential,
  signInWithPopup,
  signOut,
  User,
  user,
  UserCredential,
} from '@angular/fire/auth';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { patchState } from '@ngrx/signals';
import { firstValueFrom, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { LocalStorage } from '../core/local-storage';
import { AuthStore } from './state/auth.store';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth = inject(Auth);
  private store = inject(AuthStore);
  private destroyRef = inject(DestroyRef);
  private firestore = inject(Firestore);
  private http = inject(HttpClient);
  private localStorage = inject(LocalStorage);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private toast = inject(HotToastService);

  readonly isLoggedIn$ = authState(this.auth).pipe(map((aUser: User | null) => !!aUser));

  readonly user$ = user(this.auth);
  readonly claims$: Observable<any>;

  private groups = signal<string[]>([]);
  readonly $groups = this.groups.asReadonly();

  constructor() {
    this.claims$ = authState(this.auth)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(authUser => patchState(this.store, {
          authUser,
          isLoggedIn: !!authUser
        })),
        switchMap(authUser => authUser?.getIdTokenResult() ?? of(null)),
        map((token: IdTokenResult | null) => token?.claims ?? null),
        tap(claims => patchState(this.store, { claims }))
      );

    this.claims$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(async claims => {
          if (!claims) {
            return null;
          }

          let userDocPath = `/users/${claims?.sub}`;
          if (claims?.accountType === 'company') {
            userDocPath = `/companies/${claims?.companyId }/users/${claims?.sub}`;
          }
          const userRef = doc(this.firestore, userDocPath);
          const user = await getDoc(userRef);
          return {
            id: user.id,
            ...user.data()
          };
        })
      )
      .subscribe(user => {
        patchState(this.store, { userProfile: user });
      });
  }

  async initSignIn(provider: AuthProvider, isCompany = false): Promise<any> {
    try {
      let authResult = await signInWithPopup(this.auth, provider);

      if (this.store.authAccountLink() && this.store.credentialToLink()) {
        await linkWithCredential(authResult.user, this.store.credentialToLink());
        this.toast.success('Account linked successfully!');
        this.cancelAccountLinking();
      }

      this.redirectToApp(authResult);

    } catch (err: any) {
      if (err.code === 'auth/account-exists-with-different-credential') {
        patchState(this.store, {
          authAccountLink: true,
          credentialToLink: err.customData?._tokenResponse, // The pending Facebook credential.
          providerToLink: provider,
          emailToLink: err.customData.email, // The provider account's email address.
          loginMessage: `Email Already Exists!`
        });

        await firstValueFrom(this.toast.error('Email Already Exists Under a Different Account! Please login with your existing account or contact us if issues persist!', {duration: 3000}).afterClosed);
        this.cancelAccountLinking();
        this.router.navigateByUrl('/sign-in');
        return;
      } else {
        console.error('error', err);
        this.snackBar.open('There was an error logging you in!', 'ok', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: [ 'bg-red-50', 'text-red-600' ]
        });

        return false;
      }
    }
  }



  async redirectToApp(authResult: UserCredential): Promise<any> {
    const idToken: any = await authResult.user.getIdTokenResult();

    const redirect = this.localStorage.getItem('redirect');

    if (redirect) {
      this.localStorage.removeItem('redirect');
      return this.router.navigateByUrl(redirect);
    }

    if (idToken?.claims?.role === 'admin') {
      this.router.navigateByUrl('/app/admin/verifications');
    } else if (idToken?.claims?.accountType === 'candidate') {
      this.router.navigateByUrl('/app/candidate/profile');
    } else if (idToken?.claims?.accountType === 'company') {
      this.router.navigateByUrl('/app/company/requests');
    }
  }

  async cancelAccountLinking(): Promise<void> {
    patchState(this.store, {
      authAccountLink: false,
      credentialToLink: null,
      providerToLink: null,
      emailToLink: null,
      loginMessage: null
    });
  }

  async signOut(): Promise<void> {
    await signOut(this.auth);

    this.router.navigateByUrl('/');
  }
}

