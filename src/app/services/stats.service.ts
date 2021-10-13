import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StatusCountReport } from '../models/status-count-report.model';
import { ApiBaseService } from './api-base.service';

@Injectable()
export class StatsService  extends ApiBaseService {
  
  private apiResource = this.apiURL.concat("stats");

  load(): Observable<StatusCountReport[]> {
  
    const url = `${this.apiResource}/statuscountdaily`;

    return this.http.get<StatusCountReport[]>(url, this.httpOptions);
    
  }

  
}

