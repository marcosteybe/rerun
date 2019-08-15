import {Injectable} from '@angular/core';
import {SwUpdate} from '@angular/service-worker';
import {MatSnackBar} from '@angular/material';

@Injectable()
export class UpdateService {

  constructor(private updates: SwUpdate, private snackbar: MatSnackBar) {
    updates.available.subscribe(event => {
      console.log('current version is', event.current);
      console.log('available version is', event.available);
      this.askUserToUpdate();
    });
  }

  private askUserToUpdate() {
    const snack = this.snackbar.open('A new version of this app is available.', 'Update');
    return snack.onAction().subscribe(() => {
      this.updateApp();
    });
  }

  private updateApp() {
    this.updates.activateUpdate().then(() => document.location.reload());
  }
}
