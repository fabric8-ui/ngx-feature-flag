import { HttpClientModule } from '@angular/common/http';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { Feature } from '../models/feature';
import { FeatureTogglesService } from '../service/feature-toggles.service';
import { FeatureToggleComponent } from './feature-toggle.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: `f8-host-component`,
  template: `
    <f8-feature-toggle featureName="Planner" [userLevel]="user"></f8-feature-toggle>
    <ng-template #user><div>My content here</div></ng-template>
  `
})
class TestHostComponent1 {}

@Component({
  selector: `f8-host-component`,
  template: `
    <f8-feature-toggle featureName="Planner" [userLevel]="user" [showFeatureOptIn]="true">
    </f8-feature-toggle>
    <ng-template #user><div>My content here</div></ng-template>
  `
})
class TestHostComponent2 {}

@Component({
  selector: `f8-feature-warning-page`,
  template: `
    <div>Warning Page!</div>
  `
})
class TestWarningComponent {}

describe('FeatureToggleComponent', () => {
  let mockFeatureService: jasmine.SpyObj<FeatureTogglesService>;
  let hostFixture1: ComponentFixture<TestHostComponent1>;
  let hostFixture2: ComponentFixture<TestHostComponent2>;

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

  beforeEach(() => {
    mockFeatureService = jasmine.createSpyObj('FeatureTogglesService', ['getFeature']);

    TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientModule, RouterModule],
      declarations: [
        FeatureToggleComponent,
        TestHostComponent1,
        TestHostComponent2,
        TestWarningComponent
      ],
      providers: [{ provide: FeatureTogglesService, useValue: mockFeatureService }],
      schemas: [NO_ERRORS_SCHEMA]
    });

    hostFixture1 = TestBed.createComponent(TestHostComponent1);
    hostFixture2 = TestBed.createComponent(TestHostComponent2);
  });

  it('should render content if feature is user enabled', async(() => {
    mockFeatureService.getFeature.and.returnValue(of(feature1));
    hostFixture1.detectChanges();
    hostFixture1.whenStable().then(() => {
      expect(hostFixture1.nativeElement.querySelector('div').innerText).toEqual('My content here');
    });
  }));

  it('should not render content if feature is not user enabled', async(() => {
    mockFeatureService.getFeature.and.returnValue(of(feature2));
    hostFixture1.detectChanges();
    hostFixture1.whenStable().then(() => {
      expect(hostFixture1.nativeElement.querySelector('div')).toBeNull();
    });
  }));

  it('should render default warning template when showFeatureOptIn is true', async(() => {
    mockFeatureService.getFeature.and.returnValue(of(feature2));
    hostFixture2.detectChanges();
    hostFixture2.whenStable().then(() => {
      expect(hostFixture2.nativeElement.querySelector('div').innerText).toEqual('Warning Page!');
    });
  }));
});
