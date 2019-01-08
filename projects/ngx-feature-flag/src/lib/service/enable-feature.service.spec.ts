import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest
} from '@angular/common/http/testing';
import { async, getTestBed, TestBed } from '@angular/core/testing';
import { AuthenticationService } from 'ngx-login-client';
import { first } from 'rxjs/operators';
import { FABRIC8_FEATURE_TOGGLES_API_URL } from './feature-toggles.service';
import { EnableFeatureService, ExtProfile, ExtUser } from './enable-feature.service';
import { Logger } from 'ngx-base';
import { UserService } from 'ngx-login-client';

describe('EnableFeature service:', () => {
  let mockAuthService: jasmine.SpyObj<AuthenticationService>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let enableFeatureService: EnableFeatureService;
  let httpTestingController: HttpTestingController;

  let url: string;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthenticationService', ['getToken']);
    mockAuthService.getToken.and.returnValue('mock-auth-token');
    mockUserService = jasmine.createSpyObj('UserService', ['loggedInUser']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: AuthenticationService,
          useValue: mockAuthService
        },
        {
          provide: FABRIC8_FEATURE_TOGGLES_API_URL,
          useValue: 'http://example.com/api/'
        },
        {
          provide: UserService,
          useValue: mockUserService
        },
        EnableFeatureService,
        Logger
      ]
    });
    enableFeatureService = getTestBed().get(EnableFeatureService);
    httpTestingController = getTestBed().get(HttpTestingController);

    url = getTestBed().get(FABRIC8_FEATURE_TOGGLES_API_URL);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be instantiable', async((): void => {
    expect(enableFeatureService).toBeDefined();
  }));

  describe('#getUpdate', () => {
    it('should send a PATCH', (done: DoneFn): void => {
      enableFeatureService
        .update({} as ExtProfile)
        .pipe(first())
        .subscribe(
          (): void => {
            done();
          }
        );
      const req: TestRequest = httpTestingController.expectOne('http://example.com/api/users');
      expect(req.request.method).toEqual('PATCH');
      req.flush({});
    });

    it('should send correct headers', (done: DoneFn): void => {
      enableFeatureService
        .update({} as ExtProfile)
        .pipe(first())
        .subscribe(
          (): void => {
            done();
          }
        );
      const req: TestRequest = httpTestingController.expectOne('http://example.com/api/users');
      expect(req.request.headers.get('Authorization')).toEqual('Bearer mock-auth-token');
      req.flush({});
    });

    it('should send correct payload', (done: DoneFn): void => {
      const attributes: ExtProfile = { featureLevel: 'beta' } as ExtProfile;
      enableFeatureService
        .update(attributes)
        .pipe(first())
        .subscribe(
          (): void => {
            done();
          }
        );
      const req: TestRequest = httpTestingController.expectOne('http://example.com/api/users');
      expect(req.request.body).toEqual(
        JSON.stringify({
          data: {
            attributes,
            type: 'identities'
          }
        })
      );
      req.flush({});
    });

    it('should return expected data', (done: DoneFn): void => {
      const data: ExtUser = {
        attributes: {
          featureLevel: 'beta'
        }
      } as ExtUser;
      enableFeatureService
        .update(data.attributes)
        .pipe(first())
        .subscribe(
          (user: ExtUser): void => {
            expect(user).toEqual(data);
            done();
          }
        );
      httpTestingController.expectOne('http://example.com/api/users').flush({ data });
    });
  });
});
