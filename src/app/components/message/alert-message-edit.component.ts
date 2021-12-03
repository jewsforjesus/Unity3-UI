import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { KeyValuePair } from 'src/app/models/key-value-pair.model';
import { AlertMessage } from 'src/app/models/alert-message.model';
import { AlertMessageService } from 'src/app/services/alert-message.service';

@Component({
  selector: 'app-alert-message-edit',
  templateUrl: 'alert-message-edit.component.html'
})
export class AlertMessageEditComponent implements OnInit {

  id: string;

  scriptLookup: KeyValuePair[];

  alertMessage: AlertMessage;

  scriptId: string;

  formHeader: String;

  feedback: any = null;

  alertMessageForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private alertMessageService: AlertMessageService
  ) {
  }

  get f() { return this.alertMessageForm.controls; }


  initalizeForm() {

    this.alertMessageForm = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required]],
      description: [''],
      address: ['', [Validators.required]],
      isText: [false],
      message: ['', [Validators.required]]
    });

  }

  
  ngOnInit() {

    this.initalizeForm();

    this.alertMessageService.lookup().subscribe(
      result => {
        this.scriptLookup = result;
      }
    );

    this
      .route
      .params
      .pipe(
        map(p => p.id),
        switchMap(id => {

          if (id === 'new') {
            this.formHeader = "New alert message";
            return of(new AlertMessage());
          }

          this.formHeader = "Edit alert message";

          return this.alertMessageService.findById(id);

        })
      )
      .subscribe(data => {

        this.feedback = null;

        this.alertMessage = data;

        this.f['id'].setValue(this.alertMessage.id);
        this.f['name'].setValue(this.alertMessage.name);
        this.f['description'].setValue(this.alertMessage.description);
        this.f['address'].setValue(this.alertMessage.address);
        this.f['isText'].setValue(this.alertMessage.isText);
        this.f['message'].setValue(this.alertMessage.message);


        });
    

  }



  load(): void {
    this.alertMessageService.load();
  }



  onSubmit() {

    const id = this.alertMessageForm.get('id').value;

    const isCreate = id == null || id.length == 0 ? true : false;

    this.alertMessageService.save(this.alertMessageForm.value, isCreate).subscribe(
      alertMessage => {
        this.alertMessage = alertMessage;
        this.feedback = { type: 'success', message: 'Save was successful!' };
        this.alertMessageForm.reset();
        this.load();
        setTimeout(() => {
          this.feedback = null;
          this.router.navigate(['/alertmessages']);
        }, 1000);
      }
    );

  }

  cancel() {
    this.router.navigate(['/alertmessages']);
  }


}
