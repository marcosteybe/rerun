import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class StravaService {

  constructor(private http: HttpClient) {
  }

  public listActivities(from: number, to: number): Observable<any> {
    let params = new HttpParams();
    return this.http.get('https://www.strava.com/api/v3/athlete/activities?before=' + from);
  }

  public athlete(): Observable<any> {
    return this.http.get('https://www.strava.com/api/v3/athlete');
  }
}
