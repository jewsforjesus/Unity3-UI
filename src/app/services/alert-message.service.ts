import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiBaseService } from './api-base.service';
import { Page } from '../models/page.model';
import { KeyValuePair } from '../models/key-value-pair.model';
import { AlertMessage } from '../models/alert-message.model';


@Injectable()
export class AlertMessageService  extends ApiBaseService {

  alertMessagesPageable: Page<AlertMessage>;

  private apiResource = this.apiURL.concat("alertmessages");

  findById(id: string): Observable<AlertMessage> {
    const url = `${this.apiResource}/${id}`;
    
    let result = this.http.get<AlertMessage>(url, this.httpOptions);

    return result;
  }

  load(): void {

    const url = `${this.apiResource}/list/0`;

    this.http.get<Page<AlertMessage>>(url, this.httpOptions).subscribe(result => {

      this.alertMessagesPageable = result;

    }
  );
    
  }

  lookup(): Observable<KeyValuePair[]> {

    const url = `${this.apiResource}/lookup`;

    return this.http.get<KeyValuePair[]>(url, this.httpOptions);
    
  }

  
  save(entity: AlertMessage, isCreate: boolean): Observable<AlertMessage> {
    
    let params = new HttpParams();

    let url = `${this.apiResource}`;

    if(isCreate){
      return this.http.post<AlertMessage>(url, entity);
    }
    else{
      return this.http.put<AlertMessage>(url, entity);
    }


  }

  delete(entity: AlertMessage): Observable<AlertMessage> {
    let url = '';
    if (entity.id) {
      url = `${this.apiResource}/${entity.id.toString()}`;
      return this.http.delete<AlertMessage>(url, this.httpOptions);
    }
    return null;
  }
}

