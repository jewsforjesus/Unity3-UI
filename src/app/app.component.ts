import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';

import { Subject } from 'rxjs';
import { LoaderService } from './services/loader.service';
import { SettingService } from './services/setting.service';

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

  constructor(public oktaAuth: OktaAuthService, private loaderService: LoaderService, private settingsService: SettingService) {

  }

  async ngOnInit() {

    this.oktaAuth.$authenticationState.subscribe(isAuthenticated => {

      this.isAuthenticated = isAuthenticated;

      this.loadAppName();

      this.loadUserInfo();

    }
    );
  }

  loadAppName() {
    
    this.settingsService.load().subscribe(result => {
      this.title = result.name;
    }
    );

  }

  async loadUserInfo() {
    // returns an object with user's claims
    const userClaims = await this.oktaAuth.getUser();

    // user name is exposed directly as property
    this.name = userClaims.name;

  }


}