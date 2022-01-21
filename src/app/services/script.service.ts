import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiBaseService } from './api-base.service';
import { Script } from '../models/script.model';
import { Page } from '../models/page.model';
import { KeyValuePair } from '../models/key-value-pair.model';


@Injectable()
export class ScriptService  extends ApiBaseService {

  scriptsPageable: Page<Script>;

  private apiResource = this.apiURL.concat("scripts");

  findById(id: string): Observable<Script> {
    const url = `${this.apiResource}/${id}`;
    
    let result = this.http.get<Script>(url, this.httpOptions);

    return result;
  }

  load(): void {

    const url = `${this.apiResource}/list/0`;

    this.http.get<Page<Script>>(url, this.httpOptions).subscribe(result => {

      this.scriptsPageable = result;

    }
  );
    
  }

  lookup(): Observable<KeyValuePair[]> {

    const url = `${this.apiResource}/lookup`;

    return this.http.get<KeyValuePair[]>(url, this.httpOptions);
    
  }

  
  save(entity: Script, isCreate: boolean): Observable<Script> {
    
    let params = new HttpParams();

    let url = `${this.apiResource}`;

    if(isCreate){
      return this.http.post<Script>(url, entity);
    }
    else{
      return this.http.put<Script>(url, entity);
    }


  }

  delete(entity: Script): Observable<Script> {
    let url = '';
    if (entity.id) {
      url = `${this.apiResource}/${entity.id.toString()}`;
      return this.http.delete<Script>(url, this.httpOptions);
    }
    return null;
  }
}

