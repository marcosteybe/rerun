import {Component} from '@angular/core';
import {AuthService} from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private authService: AuthService) {
  }

  public logout() {
    this.authService.logout();
    // this.router.navigate(['/login']);
    window.location.reload();
  }

  public isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
