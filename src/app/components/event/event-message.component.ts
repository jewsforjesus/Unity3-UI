import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventMessage, StatusCountReport } from 'src/app/models/event-message.model';
import { EventTemplate } from 'src/app/models/event-template.model';
import { Page } from 'src/app/models/page.model';
import { EventMessageService } from 'src/app/services/event-message.service';
import { EventTemplateService } from 'src/app/services/event-template.service';
import { Observable, Subscription, timer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AlertService } from 'src/app/services/alert.service';
import { KeyValuePair } from 'src/app/models/key-value-pair.model';

@Component({
  selector: 'app-event-message',
  templateUrl: 'event-message.component.html'
})
export class EventMessageComponent implements OnInit, OnDestroy {

  selectedEventMessage: EventMessage;
  eventMessage: EventMessage;
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

  get eventMessagesPageable(): Page<EventMessage> {
    return this.eventMessageService.eventMessagePageable;
  }

  constructor(    private formBuilder: FormBuilder, 
    private route: ActivatedRoute,
    private router: Router,
    private eventMessageService: EventMessageService,
    private eventTemplateService: EventTemplateService,
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

  delete(entity: EventMessage): void {
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



  // onSubmit(){

  //   const id = this.eventMessageForm.get('id').value;

  //   const isCreate = id == null || id.length == 0 ? true : false;
    
  //       this.eventMessageService.save(this.eventMessageForm.value, isCreate ).subscribe(
  //       result => {
  //           this.eventMessage = result;
  //         this.feedback = {type: 'success', message: 'Save was successful!'};
  //         this.eventMessageForm.reset();
  //         this.load(this.currentPage);
  //         setTimeout(() => {
  //           this.feedback = null;
  //         }, 1000);
  //       }
  //     );

  // }

  // clearForm(){
  //   this.eventMessageForm.reset();
  // }

  

}





