import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FeatureTogglesService } from '../service/feature-toggles.service';
import { Feature } from '../models/feature';
import { map, catchError, tap } from 'rxjs/operators';

@Component({
  selector: 'f8-feature-toggle',
  templateUrl: './feature-toggle.component.html'
})
export class FeatureToggleComponent implements OnInit {
  @ViewChild('featureOptInPage') featureOptInPage: TemplateRef<any>;

  @Input() featureName: string;
  @Input() userLevel: TemplateRef<any>;
  @Input() defaultLevel: TemplateRef<any>;
  @Input() showFeatureOptIn: boolean;

  feature$: Observable<{} | Feature>;
  template: TemplateRef<any>;

  constructor(private featureService: FeatureTogglesService) {}

  ngOnInit(): void {
    if (!this.featureName) {
      throw new Error('Attribute `featureName` should not be null or empty');
    }
    this.feature$ = this.featureService.getFeature(this.featureName).pipe(
      map((feature: Feature) => {
        if (feature.attributes) {
          return {
            enabled: feature.attributes.enabled && feature.attributes['user-enabled'],
            level: feature.attributes['enablement-level']
          };
        } else {
          return {};
        }
      }),
      tap((feature) => {
        if (feature && feature.enabled) {
          this.template = this.userLevel;
        } else if (this.showFeatureOptIn) {
          this.template = this.featureOptInPage;
        } else {
          this.template = this.defaultLevel;
        }
      }),
      catchError(() => of({}))
    );
  }

  setUserLevelTemplate() {
    this.template = this.userLevel;
  }
}
