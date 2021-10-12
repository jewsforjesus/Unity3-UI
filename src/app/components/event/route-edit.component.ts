import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { FormGroup,  FormBuilder, Validators, FormArray } from '@angular/forms';
import { Route } from 'src/app/models/route.model';
import { ConnectorService } from 'src/app/services/connector.service';
import { KeyValuePair } from 'src/app/models/key-value-pair.model';
import { MappingService } from 'src/app/services/mapping.service';
import { RouteService } from 'src/app/services/route.service';
import { QueueService } from 'src/app/services/queue.service';

@Component({
  selector: 'app-route-edit',
  templateUrl: './route-edit.component.html'
})
export class RouteEditComponent implements OnInit {

  id: string;
  eventTemplate: Route;
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
    private eventTemplateService: RouteService,
    private connectorService: ConnectorService,
    private eventMessageService: QueueService,
    private messageTemplateMapService: MappingService
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
            return of(new Route());
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
          this.router.navigate(['/routes']);

          }, 1000);
        }
      );
    }
  }



  clearForm() {
    this.eventTemplateForm.reset();
  }

  cancel() {
    this.router.navigate(['/routes']);
  }

}
