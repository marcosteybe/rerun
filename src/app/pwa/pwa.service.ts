import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import {Observable} from 'rxjs/internal/Observable';

@Injectable()
export class PwaService {

  public installPwaEvent: any;
  public updateAvailable: Observable<any>;

  constructor(private swUpdate: SwUpdate) {
    window.addEventListener('beforeinstallprompt', beforeInstallPromptEvent => {
      // prevent Chrome 67 and earlier from automatically showing the prompt
      beforeInstallPromptEvent.preventDefault();

      // stash the event so it can be triggered later.
      this.installPwaEvent = beforeInstallPromptEvent;
    });

    window.addEventListener('appinstalled', () => console.log('app successfully installed'));

    this.updateAvailable = swUpdate.available;
  }

  public installApp(): void {
    // show the prompt and wait for the user to respond
    this.installPwaEvent.prompt();
    this.installPwaEvent.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('user accepted install pwa prompt');
      } else {
        console.log('user dismissed install pwa prompt');
      }

      // prompt can only be clicked once, need to wait for next beforeinstallprompt event
      this.installPwaEvent = null;
    });
  }

  public updateApp() {
    this.swUpdate.activateUpdate().then(() => document.location.reload());
  }
}
