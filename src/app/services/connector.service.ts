import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { File } from '../models/file.model';
import { ApiBaseService } from './api-base.service';
import { Connector } from '../models/connector.model';
import { Page } from '../models/page.model';
import { KeyValuePair } from '../models/key-value-pair.model';


@Injectable()
export class ConnectorService  extends ApiBaseService {

  connectorsPageable: Page<Connector>;

  private apiResource = this.apiURL.concat("connectors");

  findById(id: string): Observable<Connector> {
    const url = `${this.apiResource}/${id}`;
    
    let result = this.http.get<Connector>(url, this.httpOptions);

    return result;
  }

  load(): void {

    const url = `${this.apiResource}/list/0`;

    this.http.get<Page<Connector>>(url, this.httpOptions).subscribe(result => {

      this.connectorsPageable = result;

    }
  );
    
  }

  lookup(): Observable<KeyValuePair[]> {

    const url = `${this.apiResource}/lookup`;

    return this.http.get<KeyValuePair[]>(url, this.httpOptions);
    
  }

  
  save(entity: Connector, isCreate: boolean): Observable<Connector> {
    
    let params = new HttpParams();

    let url = `${this.apiResource}`;

    if(isCreate){
      return this.http.post<Connector>(url, entity);
    }
    else{
      return this.http.put<Connector>(url, entity);
    }


  }

  delete(entity: Connector): Observable<Connector> {
    let url = '';
    if (entity.id) {
      url = `${this.apiResource}/${entity.id.toString()}`;
      return this.http.delete<Connector>(url, this.httpOptions);
    }
    return null;
  }
}

