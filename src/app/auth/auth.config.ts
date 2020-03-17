import {Injectable} from '@angular/core';
import {Location} from '@angular/common';

@Injectable()
export class AuthConfig {

  constructor(private location: Location) {
  }

  public tokenEndpoint = 'https://www.strava.com/oauth/token';
  public authEndpoint = 'https://www.strava.com/oauth/authorize';
  public redirectUri = window.location.origin + this.location.prepareExternalUrl('/login');
  public clientId = '24350';
  public clientSecret = 'd5b654732081a6ae48164f81a1782fa5799cd8e3';
  public scope = 'activity:read';
  public responseType = 'code';
}
