import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {StravaService} from './strava.service';
import {forkJoin} from 'rxjs/observable/forkJoin';
import {Subject} from 'rxjs/Subject';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {MyLocation} from '../model/mylocation';
import {Activity} from '../model/activity';

@Component({
  selector: 'app-search',
  styleUrls: ['search.component.scss'],
  templateUrl: 'search.component.html',
  providers: [StravaService]
})
export class SearchComponent implements OnInit, AfterViewInit {

  public displayedColumns = ['start_date', 'name', 'distance', 'moving_time', 'pace', 'total_elevation_gain', 'suffer_score', 'details'];
  public dataSource = new MatTableDataSource();
  public numberOfActivities = 0;
  public activities: any[] = [];
  public loadingActivities = true;
  private allActivitiesLoaded = false;

  public distanceFilter: string;
  private distanceFilterSubject: Subject<string> = new Subject();

  public availableLocations: MyLocation[];
  public locationFilter: MyLocation;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private stravaService: StravaService) {
    this.distanceFilterSubject
      .pipe(debounceTime(200), distinctUntilChanged())
      .subscribe(searchTextValue => {
        this.filterByDistance(searchTextValue);
      });
    this.availableLocations = [{
      viewValue: 'Dällikon',
      latLong: [47.4416951, 8.4393782]
    }, {
      viewValue: 'Förrlibuck',
      latLong: [47.3915665, 8.5087367]
    }, {
      viewValue: 'Ticino',
      latLong: [46.155042, 8.9954698]
    }];
  }

  ngOnInit() {
    // this.loadInitialActivities();
    this.loadAllActivities();
  }

  loadInitialActivities() {
    this.allActivitiesLoaded = false;
    this.loadingActivities = true;
    this.stravaService.listInitialActivities().subscribe(
      activities => {
        this.loadingActivities = false;
        this.numberOfActivities = activities.length;
        this.activities = JSON.parse(JSON.stringify(activities));
        this.dataSource.data = activities;
      },
      error => {
        console.error('error loading activities', error);
        this.loadingActivities = false;
        this.numberOfActivities = 0;
        this.activities = [];
        this.dataSource.data = [];
      });
  }

  loadAllActivities() {
    this.loadingActivities = true;

    const pageSize = 100;
    const numberOfPages = 10;
    const pages = Array.from(Array(numberOfPages).keys());

    const observables = pages.map(page => this.stravaService.listActivities(page + 1, pageSize));
    forkJoin(...observables).subscribe(
      nestedActivities => {
        const activities = [].concat(...nestedActivities);
        console.log(activities);
        this.loadingActivities = false;
        this.numberOfActivities = activities.length;
        this.activities = JSON.parse(JSON.stringify(activities));
        this.dataSource.data = activities;
        this.allActivitiesLoaded = true;
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

    let parts: string[] = distanceFilter.split('-');
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
      let tmp = distanceTo;
      distanceTo = distanceFrom;
      distanceFrom = tmp;
    }
    if (distanceFrom == distanceTo) {
      distanceFrom *= 0.9;
      distanceTo *= 1.1;
    }
    console.debug('filtering from', distanceFrom, 'to', distanceTo);
    this.dataSource.data = this.activities.filter((activity: Activity) => {
      let distance: number = activity.distance / 1000;
      return distance >= distanceFrom && distance <= distanceTo;
    });
  }

  public filterByLocation(selectedLocation: MyLocation) {
    if (selectedLocation == null) {
      return;
    }

    console.debug('filtering to', selectedLocation.viewValue, selectedLocation.latLong);
    const precision = 0.01;
    this.dataSource.data = this.activities.filter((activity: Activity) => {
      return activity.start_latlng != null
        && SearchComponent.isInRange(selectedLocation.latLong[0], activity.start_latlng[0], precision)
        && SearchComponent.isInRange(selectedLocation.latLong[1], activity.start_latlng[1], precision);
    });
  }

  public trackById(index: number, item: any) {
    return item.id;
  }

  private static isInRange(actual: number, comparable: number, precision: number): boolean {
    return Math.abs(actual - comparable) <= precision;
  }
}
