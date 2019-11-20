import { UserService } from './user.service';
import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private userService: UserService, private auth: AuthService, private router: Router) {
    // user go to google authentication to authenticate and then go back by returnUrl
    auth.user$.subscribe(user => {
      if (!user) { return; }

      // save user to database
      userService.save(user);

      let returnUrl = localStorage.getItem('returnUrl');

      if (!returnUrl) { return; }

      /* if returnUrl have existed, then remove it from local storage,
      to avoid returning to home page a lot of time unnecesserily,
      just go back by returnUrl one time in authentication */
      localStorage.removeItem('returnUrl');

      // go back by returnUrl
      router.navigateByUrl(returnUrl);
    });
  }
}
