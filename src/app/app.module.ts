import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {SearchComponent} from './search/search.component';
import {MaterialModule} from './material.module';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './auth/login.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthInterceptor} from './auth/auth.interceptor';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {HeaderComponent} from './header/header.component';
import {StorageModule} from '@ngx-pwa/local-storage';
import {StravaService} from './search/strava.service';
import {AuthService} from './auth/auth.service';
import {AuthConfig} from './auth/auth.config';
import {InstallService} from './pwa/install.service';
import {AppState} from './app.state';
import {UpdateService} from './pwa/update.service';

const appRoutes: Routes = [
  {path: 'search', component: SearchComponent},
  {path: 'login', component: LoginComponent},
  {path: '', redirectTo: 'search', pathMatch: 'full'}
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    SearchComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    FormsModule,
    MaterialModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    ServiceWorkerModule.register('./ngsw-worker.js', {enabled: environment.production}),
    StorageModule.forRoot({IDBNoWrap: true})
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: LocationStrategy, useClass: PathLocationStrategy},
    AppState,
    Location,
    HttpClientModule,
    AuthService,
    AuthConfig,
    InstallService,
    UpdateService,
    StravaService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
