import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiBaseService } from './api-base.service';
import { Page } from '../models/page.model';
import { Message } from '../models/message.model';
import { StatusCountReport } from '../models/status-count-report.model';


@Injectable()
export class QueueService  extends ApiBaseService {

  eventMessagePageable: Page<Message>;

  private apiResource = this.apiURL.concat("messages");

  findById(id: string): Observable<Message> {

    const url = `${this.apiResource}/${id}`;

    let result = this.http.get<Message>(url, this.httpOptions);

    return result;
  }

  load(status, keyword, page): void {

    let isStatusNull :boolean = (status != null && status.length == 0) || status == null ? true : false;
    let isKeywordNull : boolean = (keyword != null && keyword.length == 0) || keyword == null ? true : false;

    if (page == null || page <= 0) {
      page = 0;
    }
    else {
      page = page - 1;
    }

    let url = `${this.apiResource}/list/${page}/${status}/${keyword}`;

    if(isStatusNull == true && isKeywordNull == false){
      url = `${this.apiResource}/list/${page}/keyword/${keyword}`;
    }

    if(isStatusNull == false && isKeywordNull == true){
      url = `${this.apiResource}/list/${page}/status/${status}`;
    }

    if(isStatusNull == true && isKeywordNull == true){
      url = `${this.apiResource}/list/${page}`;
    }

    this.http.get<Page<Message>>(url, this.httpOptions).subscribe(result => {

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


  save(entity: Message, isCreate: Boolean): Observable<Message> {

    let params = new HttpParams();

    let url = `${this.apiResource}`;

    if (isCreate){
      entity.id = null;
      return this.http.post<Message>(url, entity);
    }
    else
      return this.http.put<Message>(url, entity);

  }



  delete(entity: Message): Observable<Message> {
    let url = '';
    if (entity.id) {
      url = `${this.apiResource}/${entity.id.toString()}`;
      return this.http.delete<Message>(url, this.httpOptions);
    }
    return null;
  }


  reQueue(status: string): Observable<any> {

    const url = `${this.apiResource}/reprocess/${status}`;

    return this.http.put<any>(url, this.httpOptions);

  }

  reQueueById(queueId: string): Observable<any> {

    const url = `${this.apiResource}/reprocess/queue/${queueId}`;

    return this.http.put<any>(url, this.httpOptions);

  }

}



