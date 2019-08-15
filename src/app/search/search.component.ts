import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {StravaService} from './strava.service';
import {Observable, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {Activity} from '../model/activity';
import {LocationService} from './location.service';
import {AppState} from '../app.state';
import {AppEvent} from '../app.event';

@Component({
  selector: 'rerun-search',
  styleUrls: ['search.component.scss'],
  templateUrl: 'search.component.html',
  providers: [LocationService]
})
export class SearchComponent implements OnInit, AfterViewInit {

  public displayedColumns = ['start_date', 'name', 'distance', 'moving_time', 'pace', 'total_elevation_gain', 'suffer_score', 'details'];
  public dataSource = new MatTableDataSource<Activity>();
  public numberOfActivities = 0;
  public activities: Activity[] = [];
  public loadingActivities = true;

  public distanceFilter: string;
  private distanceFilterRange: number[];
  private distanceFilterSubject: Subject<string> = new Subject();

  public availableLocations: string[];
  public locationFilter: string;

  public availableRunTypes = ['Default', 'Race', 'Long Run', 'Workout'];
  public runTypeFilter: string;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private stravaService: StravaService, private locationService: LocationService, private appState: AppState) {
    this.distanceFilterSubject
      .pipe(debounceTime(200), distinctUntilChanged())
      .subscribe(searchTextValue => {
        this.filterByDistance(searchTextValue);
      });
    appState.event.subscribe(appEvent => {
      if (AppEvent.ACTIVITIES_REFRESH === appEvent) {
        this.loadActivities(this.stravaService.refreshMyActivities());
      }
    });
  }

  ngOnInit() {
    this.availableLocations = this.locationService.listMyStartLocations();
    this.loadActivities(this.stravaService.loadMyActivities());
  }

  private loadActivities(observable: Observable<Activity[]>) {
    this.loadingActivities = true;
    observable.subscribe(activities => {
        this.loadingActivities = false;
        this.numberOfActivities = activities.length;
        this.activities = activities;
        this.dataSource.data = activities;
        this.dataSource.filteredData = activities;
      },
      error => {
        console.error('error loading activities', error);
        this.loadingActivities = false;
        this.numberOfActivities = 0;
        this.activities = [];
        this.dataSource.data = [];
      });
  }

  /**
   * Set the sort after view init since this component will be able to query its view for the initialized sort.
   */
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = (activity: Activity, column: string) => {
      switch (column) {
        case 'pace':
          return activity.moving_time / activity.distance;
        default:
          return activity[column];
      }
    };
    this.dataSource.filterPredicate = (activity: Activity, filter: string): boolean => {
      return this.matchesStartLocation(activity) && this.matchesDistance(activity) && this.matchesRunType(activity);
    };
  }

  public clearDistanceFilter() {
    this.distanceFilter = null;
    this.dataSource.data = this.activities;
  }

  public filterByDistanceKeyUp(searchTextValue: string) {
    this.distanceFilterSubject.next(searchTextValue);
  }

  public filterByDistance(distanceFilter: string) {
    if (distanceFilter == null) {
      return;
    }

    const parts: string[] = distanceFilter.split('-');
    let distanceFrom: number = parts[0] ? Number(parts[0].trim()) : NaN;
    let distanceTo: number = parts[1] ? Number(parts[1].trim()) : NaN;

    if (isNaN(distanceFrom) && isNaN(distanceTo)) {
      distanceFrom = 0;
      distanceTo = Number.MAX_SAFE_INTEGER;
    }
    if (isNaN(distanceFrom)) {
      distanceFrom = distanceTo;
    }
    if (isNaN(distanceTo)) {
      distanceTo = distanceFrom;
    }
    if (distanceTo < distanceFrom) {
      const tmp = distanceTo;
      distanceTo = distanceFrom;
      distanceFrom = tmp;
    }
    if (distanceFrom === distanceTo) {
      distanceFrom *= 0.9;
      distanceTo *= 1.1;
    }
    console.debug('filtering from', distanceFrom, 'to', distanceTo);
    this.distanceFilterRange = [distanceFrom, distanceTo];
    this.dataSource.filter = FilterCriteria.DISTANCE;
  }

  public filterByLocation(selectedLocation: string) {
    if (selectedLocation == null) {
      return;
    }

    console.debug('filtering to', selectedLocation);
    this.dataSource.filter = FilterCriteria.LOCATION;
  }

  public filterByRunType(selectedRunType: string) {
    if (selectedRunType == null) {
      return;
    }

    console.debug('filtering to', selectedRunType);
    this.dataSource.filter = FilterCriteria.RUN_TYPE;
  }

  private matchesStartLocation(activity: Activity): boolean {
    return !this.locationFilter || this.locationService.findMyStartLocation(activity).viewValue === this.locationFilter;
  }

  private matchesRunType(activity: Activity): boolean {
    return !this.runTypeFilter || activity.workout_type === this.availableRunTypes.indexOf(this.runTypeFilter);
  }

  private matchesDistance(activity: Activity): boolean {
    const distance: number = activity.distance / 1000;
    return !this.distanceFilterRange || distance >= this.distanceFilterRange[0] && distance <= this.distanceFilterRange[1];
  }

  public trackById(index: number, item: any) {
    return item.id;
  }

}

enum FilterCriteria {
  DISTANCE = 'DISTANCE',
  LOCATION = 'LOCATION',
  RUN_TYPE = 'RUN_TYPE'
}
