import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthConfig} from './auth.config';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AuthService {

  constructor(private http: HttpClient, private authConfig: AuthConfig) {
  }

  public initiateLogin() {
    window.location.href = this.authConfig.authEndpoint
      + '?client_id=' + this.authConfig.clientId
      + '&redirect_uri=' + this.authConfig.redirectUri
      + '&response_type=' + this.authConfig.responseType
      + '&scope=' + this.authConfig.scope;
  }

  public exchangeToken(code: string): Observable<any> {
    return this.http.post(this.authConfig.tokenEndpoint
      + '?client_id=' + this.authConfig.clientId
      + '&client_secret=' + this.authConfig.clientSecret
      + '&code=' + code, {});
  }

  public getToken(): string {
    return localStorage.getItem('token');
  }

  public setToken(token: string) {
    localStorage.setItem('token', token);
  }

  public hasToken(): boolean {
    return this.getToken() != null;
  }
}
