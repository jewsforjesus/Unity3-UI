import { Component, OnInit } from '@angular/core';
import { Page } from 'src/app/models/page.model';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ConnectorService } from 'src/app/services/connector.service';
import { TraceService } from 'src/app/services/trace.service';
import { KeyValuePair } from 'src/app/models/key-value-pair.model';
import { Route } from 'src/app/models/route.model';
import { RouteService } from 'src/app/services/route.service';
import { QueueService } from 'src/app/services/message.service';

@Component({
  selector: 'app-route',
  templateUrl: 'route.component.html'
})
export class RouteComponent implements OnInit {

  id: string;
  event: Route;
  eventId: string;

  connectorLookup: KeyValuePair[];
  queueNameLookup: String[];

  feedback: any = null;

  eventTemplateForm: FormGroup;

  get eventTemplatesPageable(): Page<Route> {
    return this.eventTemplateService.eventTemplatePageable;
  }

  constructor(private formBuilder: FormBuilder, 
    private route: ActivatedRoute,
    private router: Router, 
    private eventTemplateService: RouteService,
    private connectorService: ConnectorService,
    private eventMessageService: QueueService,
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

        return of(new Route());

      })
    )
    .subscribe(lookup => {


      return of(new Route());

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

  delete(entity: Route): void {
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

  deleteTrace(entity: Route) {
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
