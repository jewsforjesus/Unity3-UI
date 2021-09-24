import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiBaseService } from './api-base.service';
import { LookupGroup } from '../models/lookupGroup.model';
import { Page } from '../models/page.model';
import { MessageTemplate } from '../models/message-template.model';


@Injectable()
export class MessageTemplateService  extends ApiBaseService {

  messageTemplatePageable: Page<MessageTemplate>;

  private apiResource = this.apiURL.concat("messagetemplates");

  findById(id: string): Observable<MessageTemplate> {
    const url = `${this.apiResource}/${id}`;
    return this.http.get<MessageTemplate>(url, this.httpOptions);
  }

  load(): void {
    const url = `${this.apiResource}/list/0`;
    this.http.get<Page<MessageTemplate>>(url, this.httpOptions).subscribe(result => {
      this.messageTemplatePageable = result;
    }
  );
    
  }

  lookup(): Observable<MessageTemplate[]>{
    const url = `${this.apiResource}/lookup`;
    return this.http.get<MessageTemplate[]>(url, this.httpOptions);
  }

  loadPath(id: string): Observable<string[]> {
    const url = `${this.apiResource}/listpath/${id}`;
    return this.http.get<string[]>(url, this.httpOptions);
  }

  save(entity: MessageTemplate, isCreate: boolean): Observable<MessageTemplate> {
    
    let url = `${this.apiResource}`;

    if(isCreate){
      return this.http.post<MessageTemplate>(url, entity);
    }
    else{
      return this.http.put<MessageTemplate>(url, entity);
    }


  }


  delete(entity: MessageTemplate): Observable<MessageTemplate> {
    let params = new HttpParams();
    let url = '';
    if (entity.id) {
      url = `${this.apiResource}/${entity.id.toString()}`;
      params = new HttpParams().set('id', entity.id.toString());
      return this.http.delete<MessageTemplate>(url, this.httpOptions);
    }
    return null;
  }
  
  
}

