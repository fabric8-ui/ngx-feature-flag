import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { Logger } from 'ngx-base';
import { AuthenticationService, Profile, User, UserService } from 'ngx-login-client';
import { ConnectableObservable, Observable, throwError as observableThrowError } from 'rxjs';
import { catchError, map, publish } from 'rxjs/operators';
import { FABRIC8_FEATURE_TOGGLES_API_URL } from './feature-toggles.service';

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
export class EnableFeatureService {
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  private usersUrl: string;

  constructor(
    protected auth: AuthenticationService,
    protected http: HttpClient,
    protected logger: Logger,
    protected userService: UserService,
    @Inject(FABRIC8_FEATURE_TOGGLES_API_URL) apiUrl: string
  ) {
    if (this.auth.getToken() != undefined) {
      this.headers = this.headers.set('Authorization', 'Bearer ' + this.auth.getToken());
    }
    this.usersUrl = apiUrl + 'users';
  }

  createTransientProfile(): ExtProfile {
    let profile: ExtUser;

    (this.userService.loggedInUser.pipe(
      map(
        (user: User): void => {
          profile = cloneDeep(user) as ExtUser;
          if (profile.attributes !== undefined) {
            profile.attributes.contextInformation =
              (user as ExtUser).attributes.contextInformation || {};
          }
        }
      ),
      publish()
    ) as ConnectableObservable<User>).connect();

    return profile !== undefined && profile.attributes !== undefined
      ? profile.attributes
      : ({} as ExtProfile);
  }

  update(profile: ExtProfile): Observable<ExtUser> {
    const payload: any = JSON.stringify({
      data: {
        attributes: profile,
        type: 'identities'
      }
    });
    return this.http.patch<ExtUserResponse>(this.usersUrl, payload, { headers: this.headers }).pipe(
      map((response: ExtUserResponse): ExtUser => response.data),
      catchError((error: HttpErrorResponse): Observable<ExtUser> => this.handleError(error))
    );
  }

  protected handleError(error: HttpErrorResponse): Observable<ExtUser> {
    this.logger.error(error);
    return observableThrowError(error.message || error);
  }
}
