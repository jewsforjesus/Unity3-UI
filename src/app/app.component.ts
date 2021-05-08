import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';

import { Subject } from 'rxjs';
import { AppInfoService } from 'src/app/services/app-info.service';
import { LoaderService } from './services/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  collapsed = true;

  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
  }


  title = 'integally';
  isAuthenticated: boolean;
  name: string;
  preferred_username: string;

  myChart: any;

  isLoading: Subject<boolean> = this.loaderService.isLoading;

  constructor(public oktaAuth: OktaAuthService, private loaderService: LoaderService, private appInfoService: AppInfoService) {
    
    this.oktaAuth.$authenticationState.subscribe(async isAuthenticated => {
      this.isAuthenticated = isAuthenticated

      // Get user information
      const user = await this.oktaAuth.getUser();
      this.name = user.name;
      this.preferred_username = user.preferred_username;

      this.loadAppName();


    });

  }

  async ngOnInit() {

  }

  loadAppName() {
    
    this.appInfoService.load().subscribe(result => {
      this.title = result.name;
    }
    );

  }

  async signout() {
    // Will redirect to Okta to end the session then redirect back to the configured `postLogoutRedirectUri`
    await this.oktaAuth.signOut();

    this.oktaAuth.tokenManager.clear();
  }


}