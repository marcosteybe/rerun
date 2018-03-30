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

  displayedColumns = ['date', 'name', 'distance', 'duration', 'pace', 'elevation', 'suffer_score'];
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
