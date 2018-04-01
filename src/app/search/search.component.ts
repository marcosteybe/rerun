import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {SearchService} from './search.service';

@Component({
  selector: 'app-search',
  styleUrls: ['search.component.scss'],
  templateUrl: 'search.component.html',
  providers: [SearchService]
})
export class SearchComponent implements OnInit, AfterViewInit {

  public displayedColumns = ['date', 'name', 'distance', 'duration', 'pace', 'elevation', 'suffer_score'];
  public dataSource = new MatTableDataSource();
  public numberOfActivities = 0;
  public activities: any[] = [];
  public loadingActivities = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private searchService: SearchService) {
  }

  ngOnInit() {
    this.loadingActivities = true;
    this.searchService.listActivities().subscribe(
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

  /**
   * Set the sort after view init since this component will be able to query its view for the initialized sort.
   */
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  filterByDistance(distance: string) {
    if (distance == null) {
      return;
    }

    let parts: string[] = distance.split('-');
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
      distanceFrom *= 0.95;
      distanceTo *= 1.05;
    }
    console.debug('filtering from', distanceFrom, 'to', distanceTo);
    this.dataSource.data = this.activities.filter((activity: any) => {
      let distance: number = activity.distance / 1000;
      return distance >= distanceFrom && distance <= distanceTo;
    });
  }
}
