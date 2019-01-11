import { Component } from '@angular/core';

import { FeatureTogglesService } from 'ngx-feature-flag';

@Component({
  selector: 'app-feature-toggle-example',
  styles: [
    `
      .sample-form .form-horizontal .form-group {
        margin-left: 0px;
      }
      .padding-top-15 {
        padding-top: 15px;
      }
      .padding-bottom-15 {
        padding-bottom: 15px;
      }
    `
  ],
  templateUrl: './feature-toggle-service.example.component.html'
})
export class FeatureToggleServiceExampleComponent {
  getAllFeaturesOutput: string;
  constructor(private featureToggleService: FeatureTogglesService) {}

  getAllFeaturesEnabledByLevel() {
    this.featureToggleService.getAllFeaturesEnabledByLevel().subscribe((val) => {
      console.log(JSON.stringify(val));
      this.getAllFeaturesOutput = JSON.stringify(val, null, 2);
    });
  }
  getAllFeaturesEnabledByIds() {
    this.featureToggleService.getFeatures(['Test']).subscribe((val) => {
      console.log(JSON.stringify(val));
      this.getAllFeaturesOutput = JSON.stringify(val, null, 2);
    });
  }
}
