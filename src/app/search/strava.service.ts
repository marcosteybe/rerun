import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {forkJoin, Observable, of} from 'rxjs';
import {Activity} from '../model/activity';
import {LocalStorage} from '@ngx-pwa/local-storage';
import {map, mergeMap, switchMap} from 'rxjs/operators';

@Injectable()
export class StravaService {

  private static readonly CACHED_ACTIVITIES = 'CACHED_ACTIVITIES';

  constructor(private http: HttpClient, private localStorage: LocalStorage) {
  }

  public loadMyself(): Observable<any> {
    return this.http.get('https://www.strava.com/api/v3/athlete');
  }

  public loadMyActivities(): Observable<Activity[]> {
    return forkJoin([this.loadRecentActivities(), this.loadCachedActivities()]).pipe(
      map(data => this.mergeActivities(data[0], data[1])),
      switchMap(activities => this.cacheActivities(activities))
    );
  }

  private loadRecentActivities(): Observable<Activity[]> {
    return this.loadActivities(1, 20);
  }

  private loadAllActivities(): Observable<Activity[]> {
    const pageSize = 100;
    const numberOfPages = 10;
    const pages = Array.from(Array(numberOfPages).keys());

    const observables = pages.map(page => this.loadActivities(page + 1, pageSize));
    return forkJoin(...observables).pipe(
      map(nestedActivities => [].concat(...nestedActivities))
    );
  }

  private loadCachedActivities(): Observable<Activity[]> {
    return this.localStorage.getItem(StravaService.CACHED_ACTIVITIES).pipe(
      mergeMap(cachedData => {
        console.log('cached activities', cachedData);
        return cachedData ? of(<Activity[]>cachedData) : this.loadAllActivities();
      })
    );
  }

  private cacheActivities(activities: Activity[]): Observable<Activity[]> {
    return this.localStorage.setItem(StravaService.CACHED_ACTIVITIES, activities).pipe(
      map(() => activities)
    );
  }

  private mergeActivities(latestActivities: Activity[], cachedActivities: Activity[]): Activity[] {
    const allActivities = latestActivities.concat(cachedActivities);
    return allActivities.filter((activity, index, self) => self.findIndex(a => a.id === activity.id) === index);
  }

  private loadActivities(page: number = 1, pageSize: number = 20): Observable<Activity[]> {
    return this.http.get<Activity[]>('https://www.strava.com/api/v3/athlete/activities?page=' + page + '&per_page=' + pageSize);
  }
}
