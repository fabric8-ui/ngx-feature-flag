import { Injectable } from '@angular/core';

@Injectable()
export class NotificationsMockService {
  message(notification) {
    console.log(notification['message']);
  }
}
