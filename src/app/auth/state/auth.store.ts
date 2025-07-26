import { computed } from '@angular/core';
import { AuthProvider, User } from '@angular/fire/auth';
import { signalStore, withComputed, withState } from '@ngrx/signals';
import { Candidate } from '~models/candidate';
import { CompanyUser } from '~models/company-user';

type AppAuthState = {
  accountType: 'candidate' | 'company' | 'admin' | null;
  authAccountLink: boolean;
  authUser: User | null;
  claims: any;
  companyID: string | null;
  credentialToLink: any;
  emailToLink: string | null;
  loginMessage: string | null;
  providerToLink: AuthProvider | null;
  userProfile: Candidate | CompanyUser | null;
  isAdmin: boolean;
  isCandidate: boolean;
  isCompany: boolean;
  isLoggedIn: boolean;
}

const initialState: AppAuthState = {
  accountType: null,
  authAccountLink: false,
  credentialToLink: null,
  authUser: null,
  claims: null,
  companyID: null,
  emailToLink: null,
  loginMessage: null,
  providerToLink: null,
  userProfile: null,
  isAdmin: false,
  isCandidate: false,
  isCompany: false,
  isLoggedIn: false
};

export const AuthStore = signalStore(
  // 👇 Providing `AuthStore` at the root level.
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ authUser, claims }) => ({
    accountType: computed(() => claims()?.accountType),
    companyID: computed(() => claims()?.companyID ?? null),
    isAdmin: computed(() => claims()?.role === 'admin'),
    isCandidate: computed(() => claims()?.accountType === 'candidate'),
    isCompany: computed(() => claims()?.accountType === 'company'),
    name: computed(() => authUser()?.displayName),
    userId: computed(() => authUser()?.uid)
  }))
);
