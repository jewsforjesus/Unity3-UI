import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiBaseService } from './api-base.service';
import { Setting } from '../models/setting.model';

@Injectable()
export class SettingService  extends ApiBaseService {

  private apiResource = this.apiURL.concat("settings");


  load(): Observable<Setting> {
  
    const url = `${this.apiResource}`;
    return this.http.get<Setting>(url, this.httpOptions);
    
  }

  
}

