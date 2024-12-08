import marvinConfigs from 'marvin-configs.json';

import { GoogleLoginProvider, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  static getAuthServiceConfigs(): SocialAuthServiceConfig {
    return {
      autoLogin: false,
      providers: [
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider(marvinConfigs.googleAuth.clientId)
        },
      ],
      onError: (err) => {
        console.error(err);
      }
    } as SocialAuthServiceConfig;
  }
}