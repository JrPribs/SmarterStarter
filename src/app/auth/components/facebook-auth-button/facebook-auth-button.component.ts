import {
  ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output
} from '@angular/core';
import { FacebookAuthProvider } from '@angular/fire/auth';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';

import { FACEBOOK_ICON } from './facebook-icon';
import { AuthService } from '~auth/auth.service';

@Component({
  selector: 'app-facebook-auth-button',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './facebook-auth-button.component.html',
  styleUrls: [ './facebook-auth-button.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FacebookAuthButtonComponent {

  private authSvc = inject(AuthService);
  private iconRegistry = inject(MatIconRegistry);
  private sanitizer = inject(DomSanitizer);

  @Input() authType: string = 'Login';

  @Input() isDialog = false;

  @Output() closeDialog = new EventEmitter<void>();

  constructor() {
    this.iconRegistry.addSvgIconLiteral('facebook', this.sanitizer.bypassSecurityTrustHtml(FACEBOOK_ICON));
  }

  async loginWithFacebook(): Promise<boolean> {
    const provider = new FacebookAuthProvider();
    console.log('provider', provider);
    return await this.authSvc.initSignIn(provider);
  }


}
