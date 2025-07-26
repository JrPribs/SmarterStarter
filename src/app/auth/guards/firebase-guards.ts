import { customClaims } from '@angular/fire/auth-guard';
import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';

export const isLoggedIn = () => pipe(map(user => !!user ? true : [ '/sign-in' ]));
export const isLoggedOut = () => pipe(map(user => !!user ? [ '/app' ] : true));

export const isAdmin = () => pipe(customClaims, map((claims: any) => claims?.role === 'admin'));
export const isCandidate = () => pipe(customClaims, map((claims: any) => claims?.accountType === 'candidate' ? true : [ '/' ]));
export const isCompany = () => pipe(customClaims, map((claims: any) => claims?.accountType === 'company' ? true : [ '/' ]));
