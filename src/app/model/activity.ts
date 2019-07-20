import {MyLocation} from './mylocation';

export interface Activity {
  name: string;
  id: number;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  start_date: string;
  start_latlng: number[];
  start_location: MyLocation;
  achievement_count: number;
  kudos_count: number;
  comment_count: number;
}
