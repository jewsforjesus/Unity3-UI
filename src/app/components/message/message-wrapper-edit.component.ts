import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { Message } from 'src/app/models/message.model';
import { KeyValuePair } from 'src/app/models/key-value-pair.model';
import { QueueService } from 'src/app/services/message.service';
import { RouteService } from 'src/app/services/route.service';
import { MessageWrapperService } from 'src/app/services/message-wrapper.service';
import { MessageWrapper } from 'src/app/models/message-wrapper.model';

@Component({
  selector: 'app-message-wrapper-edit',
  templateUrl: './message-wrapper-edit.component.html'
})
export class MessageWrapperEditComponent implements OnInit {

  id: string;
  feedback: any = null;
  eventMessage: MessageWrapper;
  eventLookup: KeyValuePair[];
  formHeader: string;

  eventMessageForm = new FormGroup({
    id: new FormControl(''),
    queueId: new FormControl(''),
    partitionNumber: new FormControl(''),
    message: new FormControl(''),
    errorMessage: new FormControl(''),
    status: new FormControl(''),
    flag: new FormControl('')
  });

  constructor(
    private formBuilder: FormBuilder, 
    private route: ActivatedRoute,
    private router: Router,
    private messageWrapperService: MessageWrapperService,
    private eventTemplateService: RouteService,
    private alertService: AlertService ) {
  }

  get f() { return this.eventMessageForm.controls; }



  
  ngOnInit() {


    this.eventTemplateService.lookup().subscribe(
      result => {
        this.eventLookup = result;
      }
    );

    this
      .route
      .params
      .pipe(
        map(p => p.messageId),
        switchMap(messageId => {
          
          if (messageId === 'new') { 
            this.formHeader = "New message";
            return of(new MessageWrapper());
          }

          this.formHeader = "Edit message";

          return this.messageWrapperService.findById(messageId);
        })
      )
      .subscribe(message => {
          this.eventMessage = message;
        this.feedback = null;

          this.f['id'].setValue(this.eventMessage.id);
          this.f['queueId'].setValue(this.eventMessage.queueId);
          this.f['partitionNumber'].setValue(this.eventMessage.partitionNumber);
          this.f['message'].setValue(JSON.stringify(this.eventMessage.message));
          this.f['errorMessage'].setValue(this.eventMessage.errorMessage);
          this.f['status'].setValue(this.eventMessage.status);
          this.f['flag'].setValue(this.eventMessage.flag);

        }
      );
  }

  load(): void {
    this.messageWrapperService.findById(this.eventMessage.id);
  }


  onSubmit(){

    if (confirm('Are you sure? This will put the message back to queue as new message.')) {

    const id = this.eventMessage.id;

    const isCreate = id == null || id.length == 0 ? true : false;
    
        this.messageWrapperService.save(this.eventMessageForm.value, isCreate ).subscribe(
        result => {
            this.eventMessage = result;
          this.feedback = {type: 'success', message: 'Save was successful!'};
          this.eventMessageForm.reset();
          this.load();
          setTimeout(() => {
            this.feedback = null;
            this.router.navigate(['/messagewrappers/queue/' + this.eventMessage.queueId]);
          }, 1000);
        }
      );

    }
  }

  cancel() {
    this.router.navigate(['/messagewrappers/queue/'+ this.eventMessage.queueId]);
  }
}
