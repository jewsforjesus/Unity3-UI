import { Component, OnInit } from '@angular/core';
import { Page } from 'src/app/models/page.model';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Connector } from 'src/app/models/connector.model';
import { EventTemplateService } from 'src/app/services/event-template.service';
import { EventTemplate } from 'src/app/models/event-template.model';
import { ConnectorService } from 'src/app/services/connector.service';
import { EventMessageService } from 'src/app/services/event-message.service';
import { TraceService } from 'src/app/services/trace.service';
import { KeyValuePair } from 'src/app/models/key-value-pair.model';

@Component({
  selector: 'app-event-template',
  templateUrl: 'event-template.component.html'
})
export class EventTemplateComponent implements OnInit {

  id: string;
  event: EventTemplate;
  eventId: string;

  connectorLookup: KeyValuePair[];
  queueNameLookup: String[];

  feedback: any = null;

  eventTemplateForm: FormGroup;

  get eventTemplatesPageable(): Page<EventTemplate> {
    return this.eventTemplateService.eventTemplatePageable;
  }

  constructor(private formBuilder: FormBuilder, 
    private route: ActivatedRoute,
    private router: Router, 
    private eventTemplateService: EventTemplateService,
    private connectorService: ConnectorService,
    private eventMessageService: EventMessageService,
    private traceLogService: TraceService
    ) {
    
    }

  get f() { return this.eventTemplateForm.controls; }

  initalizeForm() {
  
    this.eventTemplateForm = this.formBuilder.group({
      id: [null],
      name: [null, Validators.required],
      description: [null],
      eventTemplateConnectors: this.formBuilder.array([
        this.newEventTemplateConnectorForm()
      ]),
      message: [null, Validators.required],
      traceEnabled: [true],
      inactive: [false],
      routeDefinition: [null, Validators.required],
      queueName: ['', Validators.required]
    });

  }
 
  eventTemplateConnectors(): FormArray {
    return this.eventTemplateForm.get("eventTemplateConnectors") as FormArray
  }

  newEventTemplateConnectorForm(): FormGroup {
    return this.formBuilder.group({
      id: [''],
      eventId: [''],
      connectorId: [null, [Validators.required]],
      className: ['', Validators.required],
      primaryConnector: [false]
    })
  }

  addEventTemplateConnector() {
    this.eventTemplateConnectors().push(this.newEventTemplateConnectorForm());
  }

  removeEventTemplateConnector(index: number) {
    this.eventTemplateConnectors().removeAt(index);
  }


  ngOnInit() {

    this
    .route
    .params
    .pipe(
      map(p => p.id),
      switchMap(id => {
        
        this.id = id;

        this.initalizeForm();

        this.load();

        this.connectorService.lookup().subscribe(
          result => {
            this.connectorLookup = result;
          }
        );

        this.eventMessageService.lookup().subscribe(
          result => { 
            this.queueNameLookup = result
          }
        );

        return of(new EventTemplate());

      })
    )
    .subscribe(lookup => {


      return of(new EventTemplate());

    });

 }

  load(): void {
    this.eventTemplateService.load();
  }


  onSubmit() {

    this.eventTemplateService.save(this.eventTemplateForm.value).subscribe(
      result => {
        this.event = result;
        this.feedback = {type: 'success', message: 'Save was successful!'};
        this.eventTemplateForm.reset();
        setTimeout(() => {
          this.load();
          this.feedback = null;
        }, 1000);
      }
    );



}

  delete(entity: EventTemplate): void {
    if (confirm('Are you sure?')) {
      this.eventTemplateService.delete(entity).subscribe(() => {
          this.feedback = {type: 'success', message: 'Delete was successful!'};
          setTimeout(() => {
            this.load();
            this.feedback = null;
          }, 1000);
         }
      );
    }
  }

  deleteTrace(entity: EventTemplate) {
    if (confirm('Are you sure?')) {
      this.traceLogService.deleteByEvent(this.eventId).subscribe(() => {
        this.feedback = { type: 'success', message: 'Trace delete was successful!' };
        setTimeout(() => {
          this.load();
        }, 1000);
      }
      );
      
    }
  }

  clearForm(){
    this.eventTemplateForm.reset();
  }

}
