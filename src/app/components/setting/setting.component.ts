import { Component, OnInit } from '@angular/core';
import { Setting } from 'src/app/models/setting.model';
import { SettingService } from 'src/app/services/setting.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html'
})


export class SettingComponent implements OnInit {

  constructor(private settingsService: SettingService) {
  }

  setting: Setting;

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
