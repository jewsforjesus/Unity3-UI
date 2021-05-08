import { Component, OnInit } from '@angular/core';
import { AppInfo } from 'src/app/models/app-info.model';
import { AppInfoService } from 'src/app/services/app-info.service';

@Component({
  selector: 'app-info',
  templateUrl: './app-info.component.html'
})


export class AppInfoComponent implements OnInit {

  constructor(private appInfoService: AppInfoService) {
  }

  appInfo: AppInfo;

  ngOnInit() {
    
    this.load();

    
  }

  load(): void {
    this.appInfoService.load().subscribe(result => {
        this.appInfo = result;
      }
    );
  }



}
