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

  myChart: any;

  isLoading: Subject<boolean> = this.loaderService.isLoading;

  constructor(public oktaAuth: OktaAuthService, private loaderService: LoaderService, private appInfoService: AppInfoService) {

  }

  async ngOnInit() {

    this.isAuthenticated = await this.oktaAuth.isAuthenticated();

    this.oktaAuth.$authenticationState.subscribe(isAuthenticated => {

      this.isAuthenticated = isAuthenticated;

      this.loadAppName();

      this.name = "this.oktaAuth.getUser.name";

    }
    );
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