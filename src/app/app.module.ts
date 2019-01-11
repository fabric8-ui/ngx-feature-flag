import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Broadcaster, Logger, Notifications } from 'ngx-base';
import {
  AUTH_API_URL,
  AuthenticationService,
  REALM,
  SSO_API_URL,
  UserService
} from 'ngx-login-client';
import { FeatureFlagModule } from 'ngx-feature-flag';
import { FABRIC8_FEATURE_TOGGLES_API_URL, FeatureTogglesService } from 'ngx-feature-flag';
import { AppRoutingModule } from './app-routing.module';
// App components
import { AppComponent } from './app.component';
import { FeatureToggleLoaderExampleModule } from './feature-toggle-loader/feature-toggle-loader.example.module';
import { FeatureToggleServiceExampleModule } from './feature-toggle-service/feature-toggle-service.example.module';
import { FeatureToggleExampleModule } from './feature-toggle/feature-toggle.example.module';
import { NavbarModule } from './navbar/navbar.module';
import { FeatureTogglesServiceMock } from './service/feature-toggles-mock.service';
import { DemoComponentsModule } from './welcome/demo-components.module';
import { WelcomeComponent } from './welcome/welcome.component';
import { EnableFeatureService } from 'ngx-feature-flag';
import { EnableFeatureMockService } from './service/enable-feature-mock.service';
import { NotificationsMockService } from './service/notifications-mock.service';

@NgModule({
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    HttpModule, // TODO remove the injection of Http from UserService
    DemoComponentsModule,
    NavbarModule,
    FeatureFlagModule,
    FeatureToggleExampleModule,
    FeatureToggleLoaderExampleModule,
    FeatureToggleServiceExampleModule
  ],
  declarations: [AppComponent, WelcomeComponent],
  providers: [
    { provide: AUTH_API_URL, useValue: 'https://auth.prod-preview.openshift.io/api/' },
    { provide: SSO_API_URL, useValue: 'https://sso.prod-preview.openshift.io/api/' },
    { provide: REALM, useValue: '' },
    {
      provide: FABRIC8_FEATURE_TOGGLES_API_URL,
      useValue: 'https://api.prod-preview.openshift.io/api/'
    },
    Broadcaster,
    AuthenticationService,
    UserService,
    Logger,
    Notifications,
    // FeatureTogglesService //uncomment if you want to use prod-preview service
    { provide: FeatureTogglesService, useClass: FeatureTogglesServiceMock },
    { provide: EnableFeatureService, useClass: EnableFeatureMockService },
    { provide: Notifications, useClass: NotificationsMockService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
