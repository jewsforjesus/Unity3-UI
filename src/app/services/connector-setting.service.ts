import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiBaseService } from './api-base.service';
import { ConnectorSetting } from '../models/connector.model';
import { Page } from '../models/page.model';


@Injectable()
export class ConnectorSettingService  extends ApiBaseService {

  connectorsPageable: Page<ConnectorSetting>;

  private apiResource = this.apiURL.concat("connectorsettings");

  findById(id: string): Observable<ConnectorSetting> {
    const url = `${this.apiResource}/${id}`;
    
    let result = this.http.get<ConnectorSetting>(url, this.httpOptions);

    return result;
  }

  load(connectorId: String): void {

    const url = `${this.apiResource}/list/${connectorId}/0`;

    this.http.get<Page<ConnectorSetting>>(url, this.httpOptions).subscribe(result => {

      this.connectorsPageable = result;

    }
  );
    
  }

  lookup(): Observable<ConnectorSetting[]> {

    const url = `${this.apiResource}/lookup`;

    return this.http.get<ConnectorSetting[]>(url, this.httpOptions);
    
  }

  save(entity: ConnectorSetting): Observable<ConnectorSetting> {
    
    let params = new HttpParams();

    let url = `${this.apiResource}`;

    if(entity.id == null)
      return this.http.post<ConnectorSetting>(url, entity);
    else
      return this.http.put<ConnectorSetting>(url, entity);

  }



  delete(entity: ConnectorSetting): Observable<ConnectorSetting> {
    let url = '';
    if (entity.id) {
      url = `${this.apiResource}/${entity.id.toString()}`;
      return this.http.delete<ConnectorSetting>(url, this.httpOptions);
    }
    return null;
  }
}

