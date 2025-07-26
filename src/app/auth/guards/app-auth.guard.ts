import { inject } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { Router, type CanActivateFn } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { firstValueFrom } from 'rxjs';

export const appAuthGuard: CanActivateFn = async (route, state) => {
  const auth = inject(Auth, { optional: true });

  if (auth) {
    const user = await firstValueFrom(authState(auth));

    if (!user) {
      inject(HotToastService).error('You must be logged in to access this page');
    } else {
      return true;
    }
  }

  return inject(Router).createUrlTree([ '/sign-in' ]);
};
