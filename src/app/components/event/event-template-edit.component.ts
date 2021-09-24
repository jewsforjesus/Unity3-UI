import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { EventMessageService } from 'src/app/services/event-message.service';
import { EventTemplateService } from 'src/app/services/event-template.service';
import { EventMessage } from 'src/app/models/event-message.model';
import { EventTemplate } from 'src/app/models/event-template.model';
import { Connector } from 'src/app/models/connector.model';
import { ConnectorService } from 'src/app/services/connector.service';
import { TraceService } from 'src/app/services/trace.service';

@Component({
  selector: 'app-event-template-edit',
  templateUrl: './event-template-edit.component.html'
})
export class EventTemplateEditComponent implements OnInit {

  id: string;
  eventTemplate: EventTemplate;
  eventId: string;

  connectorLookup: Connector[];
  queueNameLookup: String[];

  formHeader: String;

  feedback: any = null;

  eventTemplateForm: FormGroup;

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
      queueName: ['', Validators.required],
      route: []
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

    this.initalizeForm();

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

    this
      .route
      .params
      .pipe(
        map(p => p.id),
        switchMap(id => {

          if (id === 'new') {
            this.formHeader = "New event template";
            return of(new EventTemplate());
          }

          this.formHeader = "Edit event template";

          return this.eventTemplateService.findById(id);
        })
      )
      .subscribe(message => {
        this.eventTemplate = message;

        this.feedback = null;

        this.f['id'].setValue(this.eventTemplate.id);
        this.f['name'].setValue(this.eventTemplate.name);
        this.f['description'].setValue(this.eventTemplate.description);

        this.eventTemplateConnectors().clear();

        this.eventTemplate.eventTemplateConnectors.forEach(element => {

          let connector = this.formBuilder.group({
            id: [element.id],
            eventId: [element.eventId],
            className: [element.className],
            connectorId: [element.connectorId],
            primaryConnector: [element.primaryConnector],
          });

          this.eventTemplateConnectors().push(connector);
        });

        this.f['message'].setValue(this.eventTemplate.message);
        this.f['queueName'].setValue(this.eventTemplate.queueName);
        this.f['traceEnabled'].setValue(this.eventTemplate.traceEnabled);
        this.f['inactive'].setValue(this.eventTemplate.inactive);
        this.f['routeDefinition'].setValue(this.eventTemplate.routeDefinition);
        this.f['route'].setValue(this.eventTemplate.route);

      }
      );
  }


  load(): void {
    this.eventTemplateService.load();
  }


  onSubmit() {
    if (confirm('Are you sure?')) {
      this.eventTemplateService.save(this.eventTemplateForm.value).subscribe(
        result => {
          this.eventTemplate = result;
          this.feedback = { type: 'success', message: 'Save was successful!' };


          setTimeout(() => {
            this.load();
            this.feedback = null;
          this.router.navigate(['/eventtemplates']);

          }, 1000);
        }
      );

    }
  }

  delete(entity: EventTemplate): void {
    if (confirm('Are you sure?')) {
      this.eventTemplateService.delete(entity).subscribe(() => {
        this.feedback = { type: 'success', message: 'Delete was successful!' };
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


  setForEdit(eventTemplate: EventTemplate) {
    if (confirm('Are you sure?')) {

      this.f['id'].setValue(eventTemplate.id);
      this.f['name'].setValue(eventTemplate.name);
      this.f['description'].setValue(eventTemplate.description);

      this.eventTemplateConnectors().clear();

      eventTemplate.eventTemplateConnectors.forEach(element => {

        let connector = this.formBuilder.group({
          id: [element.id],
          eventId: [element.eventId],
          className: [element.className],
          connectorId: [element.connectorId],
          primaryConnector: [element.primaryConnector],
        });

        this.eventTemplateConnectors().push(connector);
      });


      this.f['message'].setValue(eventTemplate.message);
      this.f['queueName'].setValue(eventTemplate.queueName);
      this.f['traceEnabled'].setValue(eventTemplate.traceEnabled);
      this.f['inactive'].setValue(eventTemplate.inactive);
      this.f['routeDefinition'].setValue(eventTemplate.routeDefinition);

    }
  }

  clearForm() {
    this.eventTemplateForm.reset();
  }

  cancel() {
    this.router.navigate(['/eventtemplates']);
  }

}
