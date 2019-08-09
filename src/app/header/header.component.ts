import {Component} from '@angular/core';
import {AuthService} from '../auth/auth.service';

@Component({
  selector: 'rerun-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

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
