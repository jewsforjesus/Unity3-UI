import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiBaseService } from './api-base.service';
import { AppSetting, Article, Library } from '../models/app-setting.model';

@Injectable()
export class AppSettingService  extends ApiBaseService {

  private apiResource = this.apiURL.concat("appsettings");


  load(): Observable<AppSetting> {
  
    const url = `${this.apiResource}`;
    return this.http.get<AppSetting>(url, this.httpOptions);
    
  }

  loadArticles(): Observable<Article> {
  
    const url = `${this.apiResource}/developer/articles`;
    return this.http.get<Article>(url, this.httpOptions);
    
  }

  loadLibraries(): Observable<Library[]> {
  
    const url = `${this.apiResource}/developer/libraries`;
    return this.http.get<Library[]>(url, this.httpOptions);
    
  }

  ///developer/libraries/download
  downloadLibrary(id: string): Observable<Blob> {
  
    const url = `${this.apiResource}/developer/libraries/download/${id}`;
    return this.http.get(url, { responseType: 'blob' });
    
  }

  
}

