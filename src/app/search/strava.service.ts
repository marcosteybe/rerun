import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class StravaService {

  constructor(private http: HttpClient) {
  }

  public listInitialActivities(): Observable<any> {
    return this.http.get('https://www.strava.com/api/v3/athlete/activities?per_page=20');
  }

  public listActivities(page: number = 1, pageSize: number = 20): Observable<any> {
    return this.http.get('https://www.strava.com/api/v3/athlete/activities?page=' + page + '&per_page=' + pageSize);
  }

  public athlete(): Observable<any> {
    return this.http.get('https://www.strava.com/api/v3/athlete');
  }
}
