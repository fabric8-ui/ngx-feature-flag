import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TabsetConfig, TabsModule } from 'ngx-bootstrap/tabs';

import { FeatureFlagModule } from 'ngx-feature-flag';
import { DemoComponentsModule } from '../welcome/demo-components.module';
import { DynamicallyLoadedComponent } from './dynamically-loaded.component';
import { FeatureToggleLoaderExampleComponent } from './feature-toggle-loader.example.component';

import { FeatureFlagMapping } from 'ngx-feature-flag';
import { FeatureContainerComponent } from 'ngx-feature-flag';
import { MyFeatureFlagMapping } from './feature-flag.mapping';

@NgModule({
  imports: [
    CommonModule,
    DemoComponentsModule,
    FormsModule,
    FeatureFlagModule,
    TabsModule.forRoot()
  ],
  declarations: [FeatureToggleLoaderExampleComponent, DynamicallyLoadedComponent],
  exports: [FeatureToggleLoaderExampleComponent, DynamicallyLoadedComponent],
  providers: [TabsetConfig, { provide: FeatureFlagMapping, useClass: MyFeatureFlagMapping }],
  entryComponents: [DynamicallyLoadedComponent, FeatureContainerComponent]
})
export class FeatureToggleLoaderExampleModule {
  constructor() {}
}
