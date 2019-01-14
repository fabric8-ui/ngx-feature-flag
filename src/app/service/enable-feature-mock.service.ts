import { Injectable } from '@angular/core';
import { Profile, User } from 'ngx-login-client';
import { Observable, of } from 'rxjs';

interface ExtUserResponse {
  data: ExtUser;
}

export class ExtUser extends User {
  attributes: ExtProfile;
}

export class ExtProfile extends Profile {
  contextInformation: any;
  registrationCompleted: boolean;
  featureLevel: string;
}

@Injectable()
export class EnableFeatureMockService {
  createTransientProfile(): ExtProfile {
    const profile = {
      registrationCompleted: false
    } as ExtProfile;
    return profile;
  }

  update(profile: ExtProfile): Observable<ExtUser> {
    const response = {
      attributes: {
        featureLevel: profile.featureLevel
      } as ExtProfile
    } as ExtUser;
    return of(response);
  }
}
