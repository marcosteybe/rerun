import {Injectable} from '@angular/core';
import {SwUpdate} from '@angular/service-worker';
import {Observable} from 'rxjs/internal/Observable';
import {MatSnackBar} from '@angular/material';

@Injectable()
export class InstallService {

  private installPwaEvent: any;

  constructor() {
    window.addEventListener('beforeinstallprompt', beforeInstallPromptEvent => {
      console.log('beforeinstallprompt event', beforeInstallPromptEvent);

      // prevent Chrome 67 and earlier from automatically showing the prompt
      beforeInstallPromptEvent.preventDefault();

      // stash the event so it can be triggered later.
      this.installPwaEvent = beforeInstallPromptEvent;
    });

    window.addEventListener('appinstalled', () => console.log('app successfully installed'));
  }

  public get available() {
    return !!this.installPwaEvent;
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
}
