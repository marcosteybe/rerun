import {Injectable} from '@angular/core';

@Injectable()
export class AuthConfig {
  public tokenEndpoint = 'https://www.strava.com/oauth/token';
  public authEndpoint = 'https://www.strava.com/oauth/authorize';
  public redirectUri = window.location.origin + '/login';
  public clientId = '24350';
  public clientSecret = 'd5b654732081a6ae48164f81a1782fa5799cd8e3';
  public scope = 'public';
  public responseType = 'code';
}
