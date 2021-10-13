import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from 'src/app/models/page.model';
import { Observable, Subscription, timer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AlertService } from 'src/app/services/alert.service';
import { KeyValuePair } from 'src/app/models/key-value-pair.model';
import { Message } from 'src/app/models/message.model';
import { StatusCountReport } from 'src/app/models/status-count-report.model';
import { QueueService } from 'src/app/services/message.service';
import { RouteService } from 'src/app/services/route.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html'
})
export class MessageComponent implements OnInit, OnDestroy {

  selectedEventMessage: Message;
  eventMessage: Message;
  eventLookup: KeyValuePair[];

  currentPage: number = 1;

  statusCountReport: StatusCountReport[];

  subscriptionAutoLoad: Subscription;

  subscriptionAlertService: Subscription;

  autoLoadInterval: Observable<number> = timer(0, environment.autoLoadInterval);

  status = null;
  keyword = null;

ngOnDestroy() {
  this.subscriptionAutoLoad.unsubscribe();
}

  feedback: any = null;

  get eventMessagesPageable(): Page<Message> {
    return this.eventMessageService.eventMessagePageable;
  }

  constructor(    private formBuilder: FormBuilder, 
    private route: ActivatedRoute,
    private router: Router,
    private eventMessageService: QueueService,
    private eventTemplateService: RouteService,
    private alertService: AlertService) {
  }

  reQueueForm = new FormGroup({
    status: new FormControl('')
  });

  get f() { return this.reQueueForm.controls; }

  ngOnInit() {


    this.subscriptionAlertService = this.alertService.alert.subscribe(message => {

      //if we have any alert, stop auto refresh.
      if (message) {
        this.subscriptionAutoLoad.unsubscribe();
      } 
  
    });

    this.subscriptionAutoLoad = this.autoLoadInterval.subscribe(() => {
      this.load(this.currentPage);
      this.loadStatusCountReport();
    });

    this.reQueueForm = this.formBuilder.group({
      status: ['', [Validators.required]]
    });

    this.eventTemplateService.lookup().subscribe(
      result => {
        this.eventLookup = result;
      }
    );

    this.load(this.currentPage);

    this.loadStatusCountReport();

  }

  loadPage(page: number) {
    this.load(page);
  }

  load(page: number): void {
    this.eventMessageService.load(this.status, this.keyword, page );
  }

  loadStatusCountReport(){
    this.eventMessageService.loadStatusCountReport().subscribe(
      result => {
        this.statusCountReport = result;
      }
    );
  }

  search(){
    this.eventMessageService.load(this.status, this.keyword, this.currentPage);
  }

  clearSearch(){
    this.status = null;
    this.keyword = null;
    this.eventMessageService.load(this.status, this.keyword, this.currentPage);
  }

  onReQueueSubmit() {

    if (confirm('Are you sure?')) {


      const status = this.reQueueForm.get('status').value;

      this.eventMessageService.reQueue(status).subscribe(
        result => {

          this.eventMessageService.load(this.status, this.keyword, this.currentPage);

        }
      );
      
    }

    this.reQueueForm.reset();

  }

  clearReQueueForm() {
    this.reQueueForm.reset();
  }

  isErrorStatus(status) {

    if (status.indexOf(":") > 0) {
      status = "ERROR"
    }
    
    if (status == "ERROR") {
      return true;
    }
    else {
      return false;
    }

  }

  formatDuration(duration: any) : string {
    
    var milliseconds = Math.floor((duration % 1000) / 100),
      seconds: any = Math.floor((duration / 1000) % 60),
      minutes: any = Math.floor((duration / (1000 * 60)) % 60),
      hours: any = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;

  }

  delete(entity: Message): void {
    if (confirm('Are you sure?')) {
      this.eventMessageService.delete(entity).subscribe(() => {
          this.feedback = {type: 'success', message: 'Delete was successful!'};
          setTimeout(() => {
            this.load(this.currentPage);
            this.feedback = null;
          }, 1000);
         }
      );
    }
  }


}





