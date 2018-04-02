import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class StravaService {

  constructor(private http: HttpClient) {
  }

  public listActivities(): Observable<any> {
    return this.http.get('https://www.strava.com/api/v3/athlete/activities?per_page=200');
  }

  public athlete(): Observable<any> {
    return this.http.get('https://www.strava.com/api/v3/athlete');
  }
}
