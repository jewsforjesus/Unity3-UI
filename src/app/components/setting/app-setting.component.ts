import { Component, OnInit } from '@angular/core';
import { AppSetting } from 'src/app/models/app-setting.model';
import { AppSettingService } from 'src/app/services/app-setting.service';

@Component({
  selector: 'app-setting',
  templateUrl: './app-setting.component.html'
})


export class AppSettingComponent implements OnInit {

  constructor(private settingsService: AppSettingService) {
  }

  setting: AppSetting;

  ngOnInit() {
    
    this.load();

    
  }

  load(): void {
    this.settingsService.load().subscribe(result => {
      this.setting = result;
      }
    );
  }



}
