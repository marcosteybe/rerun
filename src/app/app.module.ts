import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {SearchComponent} from './search/search.component';
import {MaterialModule} from './material.module';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './auth/login.component';
import {
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule
} from '@angular/material';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthService} from './auth/auth.service';
import {AuthConfig} from './auth/auth.config';
import {AuthInterceptor} from './auth/auth.interceptor';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';

const appRoutes: Routes = [
  {path: 'search', component: SearchComponent},
  {path: 'login', component: LoginComponent},
  {path: '', redirectTo: 'search', pathMatch: 'full'}
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SearchComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    FormsModule,
    MaterialModule,
    MatCardModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),

    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: LocationStrategy, useClass: PathLocationStrategy},
    Location,
    HttpClientModule,
    AuthService,
    AuthConfig
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
