import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { Feature } from '../models/feature';
import { FeatureTogglesService } from '../service/feature-toggles.service';
import { FeatureToggleComponent } from './feature-toggle.component';
import { FeatureWarningPageComponent } from '../warning-page/feature-warning-page.component';

describe('FeatureToggleComponent', () => {
  let featureServiceMock: jasmine.SpyObj<FeatureTogglesService>;
  let hostFixture: ComponentFixture<TestHostComponent>;

  const feature1: Feature = {
    attributes: {
      name: 'Planner',
      description: 'Description',
      enabled: true,
      'enablement-level': 'beta',
      'user-enabled': true
    },
    id: 'Planner'
  };

  const feature2: Feature = {
    attributes: {
      name: 'Planner Query',
      description: 'Description',
      enabled: true,
      'enablement-level': 'internal',
      'user-enabled': false
    },
    id: 'PlannerQuery'
  };

  @Component({
    selector: `f8-host-component`,
    template: `
      <f8-feature-toggle featureName="Planner" [userLevel]="user"></f8-feature-toggle
      ><ng-template #user><div>My content here</div></ng-template>
    `
  })
  class TestHostComponent {}
  beforeEach(() => {
    featureServiceMock = jasmine.createSpyObj('FeatureTogglesService', [
      'isFeatureUserEnabled',
      'getFeature'
    ]);

    TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientModule],
      declarations: [FeatureToggleComponent, TestHostComponent, FeatureWarningPageComponent],
      providers: [
        {
          provide: FeatureTogglesService,
          useValue: featureServiceMock
        }
      ]
    });

    hostFixture = TestBed.createComponent(TestHostComponent);
  });

  it('should render content if feature is user enabled', async(() => {
    // given

    // featureServiceMock.isFeatureUserEnabled.and.returnValue(of(true));
    featureServiceMock.getFeature.and.returnValue(of(feature1));
    hostFixture.detectChanges();
    hostFixture.whenStable().then(() => {
      expect(hostFixture.nativeElement.querySelector('div').innerText).toEqual('My content here');
    });
  }));

  it('should not render content if feature is not user enabled', async(() => {
    // given
    // featureServiceMock.isFeatureUserEnabled.and.returnValue(of(false));
    featureServiceMock.getFeature.and.returnValue(of(feature2));

    hostFixture.detectChanges();
    hostFixture.whenStable().then(() => {
      expect(hostFixture.nativeElement.querySelector('div')).toBeNull();
    });
  }));
});
