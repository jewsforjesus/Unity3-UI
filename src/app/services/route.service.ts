import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiBaseService } from './api-base.service';
import { Page } from '../models/page.model';
import { KeyValuePair } from '../models/key-value-pair.model';
import { Route } from '../models/route.model';

@Injectable()
export class RouteService  extends ApiBaseService {

  eventTemplatePageable: Page<Route>;

  private apiResource = this.apiURL.concat("routes");

  findById(id: string): Observable<Route> {
    const url = `${this.apiResource}/${id}`;

    let result = this.http.get<Route>(url, this.httpOptions);

    return result;
  }

  load(): void {

    const url = `${this.apiResource}/list/0`;

    this.http.get<Page<Route>>(url, this.httpOptions).subscribe(result => {

      this.eventTemplatePageable = result;

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



