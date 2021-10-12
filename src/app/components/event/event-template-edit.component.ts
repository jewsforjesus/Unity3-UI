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
import { MessageTemplateMapService } from 'src/app/services/message-template-map.service';
import { KeyValuePair } from 'src/app/models/key-value-pair.model';

@Component({
  selector: 'app-event-template-edit',
  templateUrl: './event-template-edit.component.html'
})
export class EventTemplateEditComponent implements OnInit {

  id: string;
  eventTemplate: EventTemplate;
  eventId: string;

  connectorLookup: KeyValuePair[];
  queueNameLookup: String[];

  routeClassLookup: KeyValuePair[];
  eventTemplateLookup: KeyValuePair[];
  messageTemplateMapLookup: KeyValuePair[];

  formHeader: String;

  feedback: any = null;

  eventTemplateForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private eventTemplateService: EventTemplateService,
    private connectorService: ConnectorService,
    private eventMessageService: EventMessageService,
    private traceLogService: TraceService,
    private messageTemplateMapService: MessageTemplateMapService
  ) {
  }

  get f() { return this.eventTemplateForm.controls; }

  initalizeForm() {

    this.eventTemplateForm = this.formBuilder.group({
      id: [null],
      name: [null, Validators.required],
      description: [null],
      traceEnabled: [true],
      inactive: [false],
      queueName: ['', Validators.required],
      messageTemplateMapIds: this.formBuilder.array([
        this.formBuilder.control([''])
      ]),
      connectorIds: this.formBuilder.array([
        this.formBuilder.control([''])
      ]),
      routeClassPath: ['', Validators.required],
      chainedRoutes: this.formBuilder.array([
        this.formBuilder.control([''])
      ])
    });

  }

  connectorIds(): FormArray{
    return this.eventTemplateForm.get("connectorIds") as FormArray
  }

  addConnectorId() {
    this.connectorIds().push(this.formBuilder.control(['']));
  }

  removeConnectorId(index: number) {
    this.connectorIds().removeAt(index);
  }


  chainedRoutes(): FormArray {
    return this.eventTemplateForm.get("chainedRoutes") as FormArray
  }

  addChainedRoute() {
    this.chainedRoutes().push(this.formBuilder.control(['']));
  }

  removeChainedRoute(index: number) {
    this.chainedRoutes().removeAt(index);
  }

  messageTemplateMapIds(): FormArray {
    return this.eventTemplateForm.get("messageTemplateMapIds") as FormArray
  }

  newMessageTemplateMapIdForm(): FormGroup {
    return this.formBuilder.group({
      key: ['']
    })
  }

  addMessageTemplateMapId() {
    this.messageTemplateMapIds().push(this.formBuilder.control(['']));
  }

  removeMessageTemplateMapId(index: number) {
    this.messageTemplateMapIds().removeAt(index);
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

    this.messageTemplateMapService.loadLookup().subscribe(
      result => {
        this.messageTemplateMapLookup = result
      }
    );

    this.messageTemplateMapService.loadClasses("Route").subscribe(
      result => {
        this.routeClassLookup = result
      }
    );

    this.eventTemplateService.lookup().subscribe(
      result => {
        this.eventTemplateLookup = result
      }
    );


    this
      .route
      .params
      .pipe(
        map(p => p.id),
        switchMap(id => {

          if (id === 'new') {
            this.formHeader = "New Route";
            return of(new EventTemplate());
          }

          this.formHeader = "Edit Route";

          return this.eventTemplateService.findById(id);
        })
      )
      .subscribe(message => {
        this.eventTemplate = message;

        this.feedback = null;

        this.f['id'].setValue(this.eventTemplate.id);
        this.f['name'].setValue(this.eventTemplate.name);
        this.f['description'].setValue(this.eventTemplate.description);
        this.f['queueName'].setValue(this.eventTemplate.queueName);
        this.f['traceEnabled'].setValue(this.eventTemplate.traceEnabled);
        this.f['inactive'].setValue(this.eventTemplate.inactive);

        this.messageTemplateMapIds().clear();
        this.eventTemplate.messageTemplateMapIds.forEach(element => {
          this.messageTemplateMapIds().push(this.formBuilder.control(element));
        });


        this.connectorIds().clear();
        this.eventTemplate.connectorIds.forEach(element => {
          this.connectorIds().push(this.formBuilder.control(element));
        });


        this.chainedRoutes().clear();
        this.eventTemplate.chainedRoutes.forEach(element => {
          this.chainedRoutes().push(this.formBuilder.control(element));
        });


        this.f['routeClassPath'].setValue(this.eventTemplate.routeClassPath);

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



  clearForm() {
    this.eventTemplateForm.reset();
  }

  cancel() {
    this.router.navigate(['/eventtemplates']);
  }

}
