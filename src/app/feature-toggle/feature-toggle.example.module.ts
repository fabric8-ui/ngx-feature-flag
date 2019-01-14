import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TabsetConfig, TabsModule } from 'ngx-bootstrap/tabs';

import { FeatureFlagModule } from 'ngx-feature-flag';
import { DemoComponentsModule } from '../welcome/demo-components.module';
import { FeatureToggleExampleComponent } from './feature-toggle.example.component';
import { UserService, AuthenticationService } from 'ngx-login-client';

@NgModule({
  imports: [
    CommonModule,
    DemoComponentsModule,
    FormsModule,
    FeatureFlagModule,
    TabsModule.forRoot()
  ],
  declarations: [FeatureToggleExampleComponent],
  exports: [FeatureToggleExampleComponent],
  providers: [TabsetConfig, UserService, AuthenticationService]
})
export class FeatureToggleExampleModule {
  constructor() {}
}
