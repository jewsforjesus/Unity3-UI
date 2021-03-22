import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiBaseService } from './api-base.service';
import { Page } from '../models/page.model';
import { EventMessage, StatusCountReport } from '../models/event-message.model';


@Injectable()
export class EventMessageService  extends ApiBaseService {

  eventMessagePageable: Page<EventMessage>;

  private apiResource = this.apiURL.concat("eventmessages");

  findById(id: string): Observable<EventMessage> {

    const url = `${this.apiResource}/${id}`;

    let result = this.http.get<EventMessage>(url, this.httpOptions);

    return result;
  }

  load(status, keyword): void {

    let isStatusNull :boolean = (status != null && status.length == 0) || status == null ? true : false;
    let isKeywordNull : boolean = (keyword != null && keyword.length == 0) || keyword == null ? true : false;

    

     let url = `${this.apiResource}/list/0/${status}/${keyword}`;

    if(isStatusNull == true && isKeywordNull == false){
      url = `${this.apiResource}/list/0/keyword/${keyword}`;
    }

    if(isStatusNull == false && isKeywordNull == true){
      url = `${this.apiResource}/list/0/status/${status}`;
    }

    if(isStatusNull == true && isKeywordNull == true){
      url = `${this.apiResource}/list/0`;
    }

    this.http.get<Page<EventMessage>>(url, this.httpOptions).subscribe(result => {

      this.eventMessagePageable = result;

    }
    );

  }

  lookup(): Observable<string[]> {

    const url = `${this.apiResource}/lookup`;
    return this.http.get<string[]>(url, this.httpOptions);

  }

  loadStatusCountReport(): Observable<StatusCountReport[]> {

    const url = `${this.apiResource}/statuscount`;
    return this.http.get<StatusCountReport[]>(url, this.httpOptions);

  }


  save(entity: EventMessage, isCreate: Boolean): Observable<EventMessage> {

    let params = new HttpParams();

    let url = `${this.apiResource}`;

    if (isCreate){
      entity.id = null;
      return this.http.post<EventMessage>(url, entity);
    }
    else
      return this.http.put<EventMessage>(url, entity);

  }



  delete(entity: EventMessage): Observable<EventMessage> {
    let url = '';
    if (entity.id) {
      url = `${this.apiResource}/${entity.id.toString()}`;
      return this.http.delete<EventMessage>(url, this.httpOptions);
    }
    return null;
  }
}



