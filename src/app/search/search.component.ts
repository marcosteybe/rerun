import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {StravaService} from './strava.service';
import {Subject, forkJoin} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {Activity} from '../model/activity';
import {LocationService} from './location.service';

@Component({
  selector: 'app-search',
  styleUrls: ['search.component.scss'],
  templateUrl: 'search.component.html',
  providers: [StravaService, LocationService]
})
export class SearchComponent implements OnInit, AfterViewInit {

  public displayedColumns = ['start_date', 'name', 'distance', 'moving_time', 'pace', 'total_elevation_gain', 'suffer_score', 'details'];
  public dataSource = new MatTableDataSource<Activity>();
  public numberOfActivities = 0;
  public activities: Activity[] = [];
  public loadingActivities = true;
  private allActivitiesLoaded = false;

  public distanceFilter: string;
  private distanceFilterRange: number[];
  private distanceFilterSubject: Subject<string> = new Subject();

  public availableLocations: string[];
  public locationFilter: string;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private stravaService: StravaService, private locationService: LocationService) {
    this.distanceFilterSubject
      .pipe(debounceTime(200), distinctUntilChanged())
      .subscribe(searchTextValue => {
        this.filterByDistance(searchTextValue);
      });
    this.availableLocations = this.locationService.listMyStartLocations();
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

  loadAllActivities() {
    this.loadingActivities = true;

    const pageSize = 100;
    const numberOfPages = 10;
    const pages = Array.from(Array(numberOfPages).keys());

    const observables = pages.map(page => this.stravaService.listActivities(page + 1, pageSize));
    forkJoin(...observables).subscribe(
      nestedActivities => {
        const activities = [].concat(...nestedActivities);
        this.loadingActivities = false;
        this.numberOfActivities = activities.length;
        this.activities = activities;
        this.dataSource.data = activities;
        this.dataSource.filteredData = activities;
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
    this.dataSource.filterPredicate = (activity: Activity, filter: string): boolean => {
      return this.matchesStartLocation(activity) && this.matchesDistance(activity);
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

    if (!this.allActivitiesLoaded) {
      this.loadAllActivities();
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

  private matchesStartLocation(activity: Activity): boolean {
    return !this.locationFilter || this.locationService.findMyStartLocation(activity).viewValue === this.locationFilter;
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
  LOCATION = 'LOCATION'
}
