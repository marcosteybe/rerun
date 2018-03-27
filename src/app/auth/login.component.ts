import {Component} from '@angular/core';
import {AuthService} from './auth.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService) {
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      console.log('code', code);
      if (code) {
        this.authService.exchangeToken(code).subscribe((res: any) => {
          console.log(res); // TODO store athlete
          this.authService.setToken(res.access_token);
          this.router.navigate(['/search']);
        });
      }
    });
  }

  public login() {
    this.authService.initiateLogin();
  }
}
