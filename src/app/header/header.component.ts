import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {AppState} from '../app.state';
import {AppEvent} from '../app.event';
import {StravaService} from '../search/strava.service';
import {Athlete} from '../model/athlete';
import {InstallService} from '../pwa/install.service';

@Component({
  selector: 'rerun-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public athlete: Athlete;

  constructor(
    private authService: AuthService, private installService: InstallService,
    private stravaService: StravaService, private appState: AppState) {
  }

  ngOnInit() {
    this.stravaService.loadMyself().subscribe(athlete => {
      this.athlete = athlete;
    });
  }

  public logout() {
    this.authService.logout();
    window.location.reload();
  }

  public isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  public refresh() {
    this.appState.publish(AppEvent.ACTIVITIES_REFRESH);
  }
}
