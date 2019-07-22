import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {SearchComponent} from './search/search.component';
import {MaterialModule} from './material.module';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './auth/login.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthService} from './auth/auth.service';
import {AuthConfig} from './auth/auth.config';
import {AuthInterceptor} from './auth/auth.interceptor';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import {PwaService} from './pwa/pwa.service';
import {PwaComponent} from './pwa/pwa.component';

const appRoutes: Routes = [
  {path: 'search', component: SearchComponent},
  {path: 'login', component: LoginComponent},
  {path: '', redirectTo: 'search', pathMatch: 'full'}
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SearchComponent,
    PwaComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    FormsModule,
    MaterialModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: LocationStrategy, useClass: PathLocationStrategy},
    Location,
    HttpClientModule,
    AuthService,
    AuthConfig,
    PwaService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
