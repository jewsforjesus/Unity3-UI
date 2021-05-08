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

@Component({
  selector: 'app-event-message',
  templateUrl: 'event-message.component.html'
})
export class EventMessageComponent implements OnInit, OnDestroy {

  selectedEventMessage: EventMessage;
  eventMessage: EventMessage;
  eventLookup: EventTemplate[];

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



  eventMessageForm = new FormGroup({
    id: new FormControl(''),
    eventId: new FormControl(''),
    message: new FormControl('')
  });

  get f() { return this.eventMessageForm.controls; }

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

    this.eventMessageForm = this.formBuilder.group({
      id: [''],
      eventId: ['', [Validators.required]],
      message: ['', [Validators.required]]
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



  onSubmit(){

    const id = this.eventMessageForm.get('id').value;

    const isCreate = id == null || id.length == 0 ? true : false;
    
        this.eventMessageService.save(this.eventMessageForm.value, isCreate ).subscribe(
        result => {
            this.eventMessage = result;
          this.feedback = {type: 'success', message: 'Save was successful!'};
          this.eventMessageForm.reset();
          this.load(this.currentPage);
          setTimeout(() => {
            this.feedback = null;
          }, 1000);
        }
      );

  }

  clearForm(){
    this.eventMessageForm.reset();
  }

  

}





