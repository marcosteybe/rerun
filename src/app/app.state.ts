import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {AppEvent} from './app.event';

@Injectable()
export class AppState {

  private subject = new Subject<AppEvent>();
  public event = this.subject.asObservable();

  public publish(appEvent: AppEvent) {
    this.subject.next(appEvent);
  }
}
