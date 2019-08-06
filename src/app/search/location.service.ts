import {Injectable} from '@angular/core';
import {MyLocation} from '../model/mylocation';
import {Activity} from '../model/activity';

@Injectable()
export class LocationService {

  public listMyStartLocations(): string[] {
    return myLocations.map(myLocation => myLocation.viewValue);
  }

  public findMyStartLocation(activity: Activity): MyLocation {
    if (!activity || !activity.start_latlng) {
      return myLocations[0];
    }

    return myLocations.find(myLocation => this.isNear(activity.start_latlng, myLocation.latlng, 0.01)) || myLocations[0];
  }

  private isNear(actualLatLng: number[], comparableLatLng: number[], precision: number): boolean {
    return actualLatLng && comparableLatLng
      && Math.abs(actualLatLng[0] - comparableLatLng[0]) <= precision
      && Math.abs(actualLatLng[1] - comparableLatLng[1]) <= precision;
  }
}

export const myLocations: MyLocation[] = [
  {
    viewValue: 'Other',
    latlng: null
  },
  {
    viewValue: 'Dällikon',
    latlng: [47.4416951, 8.4393782]
  }, {
    viewValue: 'Förrlibuck',
    latlng: [47.3915665, 8.5087367]
  }, {
    viewValue: 'Ticino',
    latlng: [46.155042, 8.9954698]
  }
];
