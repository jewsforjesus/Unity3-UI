import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiBaseService } from './api-base.service';
import { AppSetting } from '../models/app-setting.model';

@Injectable()
export class AppSettingService  extends ApiBaseService {

  private apiResource = this.apiURL.concat("appsettings");


  load(): Observable<AppSetting> {
  
    const url = `${this.apiResource}`;
    return this.http.get<AppSetting>(url, this.httpOptions);
    
  }

  
}

