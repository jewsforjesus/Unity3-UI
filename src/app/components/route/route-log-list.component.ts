import { Component, OnInit } from '@angular/core';
import { Page } from 'src/app/models/page.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { MessageWrapper } from 'src/app/models/message-wrapper.model';
import { RouteLog } from 'src/app/models/route-log.model';
import { RouteLogService } from 'src/app/services/route-log.service';

@Component({
  selector: 'app-route-log-list',
  templateUrl: 'route-log-list.component.html'
})
export class RouteLogListComponent implements OnInit {

  messageWrapper: MessageWrapper;
  routeLogPageable: Page<RouteLog>;
  
  currentPage: number = 1;

  constructor(    private formBuilder: FormBuilder, 
    private route: ActivatedRoute,
    private routeLogService: RouteLogService) {
  }

  reQueueForm = new FormGroup({
    status: new FormControl('')
  });


  ngOnInit() {

    this
      .route
      .params
      .pipe(
        map(p => p.messageId),
        switchMap(messageId => {

          return this.routeLogService.findByMessageId(messageId);
        })
      ).subscribe(routeLog => {
        this.routeLogPageable = routeLog;
        console.log(this.routeLogPageable );
      }
    );
  
  }


}

  

 








