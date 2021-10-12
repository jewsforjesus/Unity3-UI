import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { EventMessageService } from 'src/app/services/event-message.service';
import { EventTemplateService } from 'src/app/services/event-template.service';
import { EventMessage } from 'src/app/models/event-message.model';
import { EventTemplate } from 'src/app/models/event-template.model';
import { KeyValuePair } from 'src/app/models/key-value-pair.model';

@Component({
  selector: 'app-event-message-edit',
  templateUrl: './event-message-edit.component.html'
})
export class EventMessageEditComponent implements OnInit {

  id: string;
  feedback: any = null;
  eventMessage: EventMessage;
  eventLookup: KeyValuePair[];
  formHeader: string;

  eventMessageForm = new FormGroup({
    id: new FormControl(''),
    eventId: new FormControl(''),
    message: new FormControl('')
  });

  constructor(
    private formBuilder: FormBuilder, 
    private route: ActivatedRoute,
    private router: Router,
    private eventMessageService: EventMessageService,
    private eventTemplateService: EventTemplateService,
    private alertService: AlertService ) {
  }

  get f() { return this.eventMessageForm.controls; }

  
  ngOnInit() {

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

    this
      .route
      .params
      .pipe(
        map(p => p.id),
        switchMap(id => {
          
          if (id === 'new') { 
            this.formHeader = "New message";
            return of(new EventMessage()); 
          }

          this.formHeader = "Edit message";

          return this.eventMessageService.findById(id);
        })
      )
      .subscribe(message => {
          this.eventMessage = message;
        this.feedback = null;

          this.f['id'].setValue(this.eventMessage.id);
          this.f['eventId'].setValue(this.eventMessage.eventId);
          this.f['message'].setValue(JSON.stringify(this.eventMessage.message));

        }
      );
  }

  load(): void {
    this.eventMessageService.findById(this.eventMessage.id);
  }


  onSubmit(){

    if (confirm('Are you sure? This will put the message back to queue as new message.')) {

    const id = this.f['id'].value;

    const isCreate = id == null || id.length == 0 ? true : false;
    
        this.eventMessageService.save(this.eventMessageForm.value, isCreate ).subscribe(
        result => {
            this.eventMessage = result;
          this.feedback = {type: 'success', message: 'Save was successful!'};
          //this.eventMessageForm.reset();
          //this.load();
          setTimeout(() => {
            this.feedback = null;
            this.router.navigate(['/eventmessages']);
          }, 1000);
        }
      );

    }
  }

  cancel() {
    this.router.navigate(['/eventmessages']);
  }
}
