import { Component, OnInit } from '@angular/core';
import { ConnectorService } from 'src/app/services/connector.service';
import { Connector, ConnectorSetting } from 'src/app/models/connector.model';
import { Page } from 'src/app/models/page.model';
import { ConnectorSettingService } from 'src/app/services/connector-setting.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-connector-setting',
  templateUrl: 'connector-setting.component.html'
})
export class ConnectorSettingComponent implements OnInit {

  connector: Connector;
  selectedConnectorSetting: ConnectorSetting;
  connectorSetting: ConnectorSetting;
  feedback: any = null;
  connectorId: string ;
  profiles: String[] = ['ALL', 'LOCAL', 'DEV', 'PROD'];

  connectorSettingForm = new FormGroup({
    id: new FormControl(''),
    connectorId: new FormControl(''),
    profile: new FormControl(''),
    key: new FormControl(''),
    value: new FormControl(''),
    secret: new FormControl('')
  });

  get connectorSettingsPageable(): Page<ConnectorSetting> {
    return this.connectorSettingService.connectorsPageable;
  }

  constructor(private formBuilder: FormBuilder, 
    private route: ActivatedRoute,
    private connectorSettingService: ConnectorSettingService,
    private connectorService: ConnectorService
    ) {

    
    }

 get f() { return this.connectorSettingForm.controls; }

 initalizeForm(){
  
  this.connectorSettingForm = this.formBuilder.group({
    id: [null],
    connectorId: [null],
    profile: ['',[Validators.required]],
    key: ['',[Validators.required]],
    value: ['', [Validators.required]],
    secret: [false],
  });

 }

validateValueField(){
  
  this.connectorSettingForm.get('secret').valueChanges
  .subscribe(value => {
    if(value) {
      this.f['value'].clearValidators();
    } else {
      this.f['value'].setValidators(Validators.required);
    }

    this.f['value'].updateValueAndValidity();

  });

}

  ngOnInit() {

    this.initalizeForm();
    this.validateValueField();

    this
    .route
    .params
    .pipe(
      map(p => p.connectorId),
      switchMap(id => {
        
        this.connectorId = id;

        this.connectorService.findById(this.connectorId).subscribe(
          result => {
            this.connector = result;
          }
        );
         
        this.load(this.connectorId);

        return of(new ConnectorSetting());

      })
    )
    .subscribe(connectorSetting => {


      return of(new ConnectorSetting());

    });



 }



  load(connectorId: String): void {
    this.connectorSettingService.load(connectorId);
  }


  select(selected: ConnectorSetting): void {
    this.selectedConnectorSetting = selected;
  }


  onSubmit() {

    this.connectorSettingForm.get('connectorId').setValue(this.connectorId);

    this.connectorSettingService.save(this.connectorSettingForm.value).subscribe(
      connectorSetting => {
        this.connectorSetting = connectorSetting;
        this.connectorSettingForm.reset();
        this.feedback = {type: 'success', message: 'Save was successful!'};
        setTimeout(() => {
          this.load(this.connectorId);
          this.feedback = null;
        }, 1000);
      }
    );



}

  delete(connectorSetting: ConnectorSetting): void {
    if (confirm('Are you sure?')) {
      this.connectorSettingService.delete(connectorSetting).subscribe(() => {
          this.feedback = {type: 'success', message: 'Delete was successful!'};
          setTimeout(() => {
            this.load(this.connectorId);
            this.feedback = null;
          }, 1000);
         }
      );
    }
  }

  setForEdit(connectorSetting: ConnectorSetting){
    if (confirm('Are you sure?')) {

      this.connectorSettingForm.get('id').setValue(connectorSetting.id);
      this.connectorSettingForm.get('connectorId').setValue(this.connectorId);
      this.connectorSettingForm.get('profile').setValue(connectorSetting.profile);
      this.connectorSettingForm.get('key').setValue(connectorSetting.key);
      this.connectorSettingForm.get('value').setValue(connectorSetting.value);
      this.connectorSettingForm.get('secret').setValue(connectorSetting.secret);
    }
  }

  clearForm(){
    this.connectorSettingForm.reset();
  }

}
