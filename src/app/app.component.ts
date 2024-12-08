import marvinConfigs from 'marvin-configs.json';

import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Process Thoughts For Marvin';
  
  user: SocialUser = new SocialUser();
  loggedIn: boolean = false;

  constructor(private authService: SocialAuthService) { }

  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      console.log(user);
      this.user = user;
      this.loggedIn = marvinConfigs.googleAuth.allowedUserIds.includes(user.id);
    });
  }

  signOut(): void {
    this.authService.signOut().then(() => {
      this.user = new SocialUser();
      this.loggedIn = false;
    });
  }
}
