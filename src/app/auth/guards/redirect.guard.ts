import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LocalStorage } from 'src/app/core/local-storage';

@Injectable({
  providedIn: 'root'
})
export class RedirectGuard  {

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {

    if (![ '/login', '/' ].includes(state.url)) {
      inject(LocalStorage)?.setItem('redirect', state.url);
    }

    return true;
  }

}
