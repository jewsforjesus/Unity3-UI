import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiBaseService } from './api-base.service';
import { Page } from '../models/page.model';
import { HttpParams } from '@angular/common/http';
import { Mapping } from '../models/mapping.model';
import { KeyValuePair } from '../models/key-value-pair.model';


@Injectable()
export class MappingService  extends ApiBaseService {

  messageTemplateMapPageable: Page<Mapping>;

  private apiResource = this.apiURL.concat("mappings");

  findById(id: string): Observable<Mapping> {
    const url = `${this.apiResource}/${id}`;
    
    return this.http.get<Mapping>(url, this.httpOptions);
    
  }

  load(): void {

    const url = `${this.apiResource}/list/0`;

    this.http.get<Page<Mapping>>(url, this.httpOptions).subscribe(result => {
      this.messageTemplateMapPageable = result;
    }
  );
    
  }

  loadLookup(): Observable<KeyValuePair[]> {
    const url = `${this.apiResource}/list/lookup`;
    return this.http.get<KeyValuePair[]>(url, this.httpOptions);
  }


  loadClasses(classType: string): Observable<KeyValuePair[]> {
    const url = `${this.apiResource}/classlist/${classType}`;
    return this.http.get<KeyValuePair[]>(url, this.httpOptions);
  }


  loadMethods(className: string): Observable<KeyValuePair[]> {
    const url = `${this.apiResource}/funclist/${className}`;
    return this.http.get<KeyValuePair[]>(url, this.httpOptions);
  }

  save(entity: Mapping, isCreate: boolean): Observable<Mapping> {
    let params = new HttpParams();

    let url = `${this.apiResource}`;

    if(isCreate){
      return this.http.post<Mapping>(url, entity);
    }
    else{
      return this.http.put<Mapping>(url, entity);
    }


  }



  delete(entity: Mapping): Observable<Mapping> {
    let params = new HttpParams();
    let url = '';
    if (entity.id) {
      url = `${this.apiResource}/${entity.id.toString()}`;
      params = new HttpParams().set('id', entity.id.toString());
      return this.http.delete<Mapping>(url, this.httpOptions);
    }
    return null;
  }
  

}

