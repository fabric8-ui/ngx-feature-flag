import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  Output,
  EventEmitter
} from "@angular/core";

import { AuthenticationService, UserService } from "ngx-login-client";
import { Subscription } from "rxjs";
import {
  EnableFeatureService,
  ExtProfile,
  ExtUser
} from "../service/enable-feature.service";
import { first } from "rxjs/operators";
import { Notifications, NotificationType } from "ngx-base";

export interface featureWarningData {
  title: string;
  description: string;
}

@Component({
  selector: "f8-feature-warning-page",
  templateUrl: "./feature-warning-page.component.html",
  styleUrls: ["./feature-warning-page.component.less"]
})
export class FeatureWarningPageComponent implements OnInit, OnDestroy {
  @Input() level: string;

  @Output() readonly onOptInButtonClick: EventEmitter<any> = new EventEmitter();

  enabledFeature: featureWarningData;
  profileSettingsLink: string;
  private userSubscription: Subscription;

  private featureFlagMap: Map<string, featureWarningData> = new Map([
    [
      "internal",
      {
        title: "Internal",
        description:
          "These features are only available to Red Hat users and have no guarantee of performance or stability.Use these at your own risk."
      }
    ],
    [
      "experimental",
      {
        title: "Experminetal",
        description:
          "These features are currently in experimental testing and have no guarantee of performance or stability.Use these at your own risk."
      }
    ],
    [
      "beta",
      {
        title: "Beta",
        description:
          "These features are currently in beta testing and have no guarantee of performance or stability.Use these at your own risk."
      }
    ]
  ]);

  constructor(
    private userService: UserService,
    private authService: AuthenticationService,
    private enableFeatureService: EnableFeatureService,
    private notifications: Notifications
  ) {
    if (this.authService.isLoggedIn()) {
      this.userSubscription = userService.loggedInUser.subscribe(val => {
        if (val.id) {
          this.profileSettingsLink =
            "/" + val.attributes.username + "/_settings/feature-opt-in";
        }
      });
    } else {
      this.profileSettingsLink = "/_home";
    }
  }

  ngOnInit() {
    this.enabledFeature = this.featureFlagMap.get(this.level);
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  enableFeature() {
    const profile: ExtProfile = this.getTransientProfile();
    this.enableFeatureService
      .update(profile)
      .pipe(first())
      .subscribe(
        (user: ExtUser): void => {
          this.userService.currentLoggedInUser = user;
          this.onOptInButtonClick.emit();
          this.notifications.message({
            message: `Feature Enabled!`,
            type: NotificationType.SUCCESS
          });
        },
        () => {
          this.notifications.message({
            message: "Failed to enable Feature",
            type: NotificationType.DANGER
          });
        }
      );
  }

  getTransientProfile(): ExtProfile {
    const profile: ExtProfile = this.enableFeatureService.createTransientProfile();
    if (!profile.contextInformation) {
      profile.contextInformation = {};
    }
    if (this.level) {
      profile.featureLevel = this.level;
    }
    // Delete extra information that make the update fail if present
    delete profile.username;
    if (profile) {
      delete profile["registrationCompleted"];
    }
    return profile;
  }
}
