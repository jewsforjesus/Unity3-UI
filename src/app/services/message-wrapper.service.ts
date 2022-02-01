import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiBaseService } from './api-base.service';
import { Page } from '../models/page.model';
import { KeyValuePair } from '../models/key-value-pair.model';
import { Route } from '../models/route.model';
import { MessageWrapper } from '../models/message-wrapper.model';

@Injectable()
export class MessageWrapperService  extends ApiBaseService {

  messageWrapperPageable: Page<MessageWrapper>;

  private apiResource = this.apiURL.concat("messagewrappers");

  findById(id: string): Observable<MessageWrapper> {
    const url = `${this.apiResource}/${id}`;

    let result = this.http.get<MessageWrapper>(url, this.httpOptions);

    return result;
  }

  findByQueueId(queueId: string): Observable<Page<MessageWrapper>> {
    const url = `${this.apiResource}/list/${queueId}/0`;

    let result = this.http.get<Page<MessageWrapper>>(url, this.httpOptions);
    return result;
  }

  load(queueId, pageNumber): void {

    if (pageNumber == null || pageNumber <= 0) {
      pageNumber = 0;
    }
    else {
      pageNumber = pageNumber - 1;
    }

    let url = `${this.apiResource}/list/${queueId}/${pageNumber}`;

    this.http.get<Page<MessageWrapper>>(url, this.httpOptions).subscribe(result => {

      this.messageWrapperPageable = result;

    }
    );

  }

  // load(queueId: string, pageNumber: number): void {

  //   const url = `${this.apiResource}/list/${queueId}/${pageNumber}`;

  //   console.log(url);

  //   this.http.get<Page<MessageWrapper>>(url, this.httpOptions).subscribe(result => {

  //     this.messageWrapperPageable = result;

  //   }
  //   );

  // }

  lookup(): Observable<KeyValuePair[]> {

    const url = `${this.apiResource}/lookup`;
    return this.http.get<KeyValuePair[]>(url, this.httpOptions);

  }



  save(entity: MessageWrapper, isCreate: Boolean): Observable<MessageWrapper> {

    let params = new HttpParams();

    let url = `${this.apiResource}`;

    if (isCreate){
      entity.id = null;
      return this.http.post<MessageWrapper>(url, entity);
    }
    else
      return this.http.put<MessageWrapper>(url, entity);

  }



  delete(messageWrapper: MessageWrapper): Observable<MessageWrapper> {
    let url = '';
    if (messageWrapper.id) {
      url = `${this.apiResource}/${messageWrapper.id.toString()}`;
      return this.http.delete<MessageWrapper>(url, this.httpOptions);
    }
    return null;
  }
}



