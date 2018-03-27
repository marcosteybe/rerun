import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {SearchService} from './search.service';

@Component({
  selector: 'app-search',
  styleUrls: ['search.component.css'],
  templateUrl: 'search.component.html',
  providers: [SearchService]
})
export class SearchComponent implements OnInit, AfterViewInit {

  displayedColumns = ['start_date', 'name', 'distance', 'moving_time', 'total_elevation_gain'];
  dataSource = new MatTableDataSource();

  resultsLength = 0;
  isLoadingResults = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private searchService: SearchService) {
  }

  ngOnInit() {
    this.isLoadingResults = true;
    this.searchService.listActivities().subscribe(
      activities => {
        this.isLoadingResults = false;
        this.resultsLength = activities.length;
        this.dataSource.data = activities;
      },
      error => {
        console.error('error loading activities', error);
        this.isLoadingResults = false;
        this.resultsLength = 0;
        this.dataSource.data = [];
      });
  }

  /**
   * Set the sort after the view init since this component will
   * be able to query its view for the initialized sort.
   */
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
}
