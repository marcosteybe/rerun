import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Activity} from '../model/activity';
import {LocationService} from './location.service';

@Injectable()
export class StravaService {

  constructor(private http: HttpClient, private locationService: LocationService) {
  }

  public listInitialActivities(): Observable<Activity[]> {
    return this.http.get<Activity[]>('https://www.strava.com/api/v3/athlete/activities?per_page=20');
  }

  public listActivities(page: number = 1, pageSize: number = 20): Observable<Activity[]> {
    return this.http.get<Activity[]>('https://www.strava.com/api/v3/athlete/activities?page=' + page + '&per_page=' + pageSize);
  }

  public athlete(): Observable<any> {
    return this.http.get('https://www.strava.com/api/v3/athlete');
  }
}
