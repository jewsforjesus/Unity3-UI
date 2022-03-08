import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiBaseService } from './api-base.service';
import { Page } from '../models/page.model';
import { Field, Template } from '../models/template.model';


@Injectable()
export class TemplateService  extends ApiBaseService {

  messageTemplatePageable: Page<Template>;

  private apiResource = this.apiURL.concat("templates");

  findById(id: string): Observable<Template> {
    const url = `${this.apiResource}/${id}`;
    return this.http.get<Template>(url, this.httpOptions);
  }

  load(): void {
    const url = `${this.apiResource}/list/0`;
    this.http.get<Page<Template>>(url, this.httpOptions).subscribe(result => {
      this.messageTemplatePageable = result;
    }
  );
    
  }

  lookup(): Observable<Template[]>{
    const url = `${this.apiResource}/lookup`;
    return this.http.get<Template[]>(url, this.httpOptions);
  }

  loadPath(id: string): Observable<string[]> {
    const url = `${this.apiResource}/listpath/${id}`;
    return this.http.get<string[]>(url, this.httpOptions);
  }

  save(entity: Template, isCreate: boolean): Observable<Template> {
    
    let url = `${this.apiResource}`;

    if(isCreate){
      return this.http.post<Template>(url, entity);
    }
    else{
      return this.http.put<Template>(url, entity);
    }


  }

  editField(id: string, originalPath: string, field: Field): Observable<Template> {
    
    let url = `${this.apiResource}/field/${id}`;

    let params = new HttpParams().set('path', originalPath);

    return this.http.put<Template>(url, field,{params});

  }

  addField(id: string, parentPath: string, field: Field): Observable<Template> {
    
    let url = `${this.apiResource}/field/${id}`;

    let params = new HttpParams().set('path', parentPath);

    return this.http.post<Template>(url, field,{params});

  }

  deleteField(id: string, path: string): Observable<Template> {
    
    let url = `${this.apiResource}/field/${id}`;

    let params = new HttpParams().set('path', path);

    return this.http.delete<Template>(url,{params});

  }


  delete(entity: Template): Observable<Template> {
    let params = new HttpParams();
    let url = '';
    if (entity.id) {
      url = `${this.apiResource}/${entity.id.toString()}`;
      params = new HttpParams().set('id', entity.id.toString());
      return this.http.delete<Template>(url, this.httpOptions);
    }
    return null;
  }
  
  
}

