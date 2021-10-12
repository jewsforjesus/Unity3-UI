import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiBaseService } from './api-base.service';
import { EventTemplate } from '../models/event-template.model';
import { Page } from '../models/page.model';
import { KeyValuePair } from '../models/key-value-pair.model';

@Injectable()
export class EventTemplateService  extends ApiBaseService {

  eventTemplatePageable: Page<EventTemplate>;

  private apiResource = this.apiURL.concat("events");

  findById(id: string): Observable<EventTemplate> {
    const url = `${this.apiResource}/${id}`;

    let result = this.http.get<EventTemplate>(url, this.httpOptions);

    return result;
  }

  load(): void {

    const url = `${this.apiResource}/list/0`;

    this.http.get<Page<EventTemplate>>(url, this.httpOptions).subscribe(result => {

      this.eventTemplatePageable = result;

    }
    );

  }

  lookup(): Observable<KeyValuePair[]> {

    const url = `${this.apiResource}/lookup`;
    return this.http.get<KeyValuePair[]>(url, this.httpOptions);

  }


  save(entity: EventTemplate): Observable<EventTemplate> {

    let params = new HttpParams();

    let url = `${this.apiResource}`;

    if (entity.id == null)
      return this.http.post<EventTemplate>(url, entity);
    else
      return this.http.put<EventTemplate>(url, entity);

  }



  delete(entity: EventTemplate): Observable<Event> {
    let url = '';
    if (entity.id) {
      url = `${this.apiResource}/${entity.id.toString()}`;
      return this.http.delete<Event>(url, this.httpOptions);
    }
    return null;
  }
}



