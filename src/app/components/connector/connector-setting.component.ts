import { Component, OnInit } from '@angular/core';
import { ConnectorService } from 'src/app/services/connector.service';
import { Connector, ConnectorSetting } from 'src/app/models/connector.model';
import { Page } from 'src/app/models/page.model';
import { ConnectorSettingService } from 'src/app/services/connector-setting.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  profiles: any[] = [
    {name:'LOCAL',isSelected:false},
    {name:'DEV',isSelected:false},
    {name:'PROD',isSelected:false},
  ]

  selectedProfiles: String[] = [];

  connectorSettingForm = new FormGroup({
    id: new FormControl(''),
    connectorId: new FormControl(''),
    profile: new FormArray([]),
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
    profile: this.formBuilder.array([]),
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

 onCheckboxChange(e) {
  const checkArray: FormArray = this.connectorSettingForm.get('profile') as FormArray;

  if (e.target.checked) {
    checkArray.push(new FormControl(e.target.value));
  } else {
    let i: number = 0;
    checkArray.controls.forEach((item: FormControl) => {
      if (item.value == e.target.value) {
        checkArray.removeAt(i);
        return;
      }
      i++;
    });
  }
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

        this.clearForm();

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

      this.clearForm();

      this.connectorSettingForm.get('id').setValue(connectorSetting.id);
      this.connectorSettingForm.get('connectorId').setValue(this.connectorId);
      //this.connectorSettingForm.get('profile').setValue(connectorSetting.profile);
          
      const checkArray: FormArray = this.connectorSettingForm.get('profile') as FormArray;
      
      if(connectorSetting.profile != null){

        connectorSetting.profile.forEach(p => {
          
            checkArray.push(new FormControl(p));

            this.profiles.forEach(pa =>{
              if(pa.name === p){
                pa.isSelected = true;
              }
              
            });

        });


      }
      

      this.connectorSettingForm.get('key').setValue(connectorSetting.key);
      this.connectorSettingForm.get('value').setValue(connectorSetting.value);
      this.connectorSettingForm.get('secret').setValue(connectorSetting.secret);
    }

  }

  clearForm(){

            //reset selected items
          this.profiles.forEach(pa =>{
              pa.isSelected = false;
          });

          //remove from form
          const checkArray: FormArray = this.connectorSettingForm.get('profile') as FormArray;
  
          checkArray.clear();


    this.connectorSettingForm.reset();

  }

  getShortName(items:string[]): string{

    let result: string = '';

    if(items == null)
      return result;

    let index: number = 1;
    items.sort().forEach(p=>{

      if( p != null){
        if(index < items.length){
          result += p.charAt(0) + '|';
        }
        else{
          result += p.charAt(0);
        }
    }

      index++;
    });

    return result;

  }



}