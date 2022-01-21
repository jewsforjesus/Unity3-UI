import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiBaseService } from './api-base.service';
import { Page } from '../models/page.model';
import { KeyValuePair } from '../models/key-value-pair.model';
import { Route } from '../models/route.model';
import { RouteLog } from '../models/route-log.model';

@Injectable()
export class RouteLogService  extends ApiBaseService {

  routeLogPageable: Page<RouteLog>;

  private apiResource = this.apiURL.concat("routelogs");

  findById(id: string): Observable<RouteLog> {
    const url = `${this.apiResource}/${id}`;

    let result = this.http.get<RouteLog>(url, this.httpOptions);
    return result;
  }

  findByMessageId(messageId: string): Observable<Page<RouteLog>> {
    const url = `${this.apiResource}/list/${messageId}/0`;

    let result = this.http.get<Page<RouteLog>>(url, this.httpOptions);
    return result;
  }

  load(queueId: string): void {

    const url = `${this.apiResource}/list/${queueId}/0`;

    this.http.get<Page<RouteLog>>(url, this.httpOptions).subscribe(result => {

      this.routeLogPageable = result;

    }
    );

  }

  lookup(): Observable<KeyValuePair[]> {

    const url = `${this.apiResource}/lookup`;
    return this.http.get<KeyValuePair[]>(url, this.httpOptions);

  }


  save(entity: Route): Observable<Route> {

    let params = new HttpParams();

    let url = `${this.apiResource}`;

    if (entity.id == null)
      return this.http.post<Route>(url, entity);
    else
      return this.http.put<Route>(url, entity);

  }



  delete(entity: Route): Observable<Event> {
    let url = '';
    if (entity.id) {
      url = `${this.apiResource}/${entity.id.toString()}`;
      return this.http.delete<Event>(url, this.httpOptions);
    }
    return null;
  }
}



