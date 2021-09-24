import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageTemplate } from 'src/app/models/message-template.model';
import { MessageTemplateService } from 'src/app/services/message-template.service';

@Component({
  selector: 'app-message-template-edit',
  templateUrl: './message-template-edit.component.html'
})
export class MessageTemplateEditComponent implements OnInit {

  id: string;

  messageTemplate: MessageTemplate;

  templateId: string;

  formHeader: String;

  feedback: any = null;

  messageTemplateForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageTemplateService: MessageTemplateService
  ) {
  }

  get f() { return this.messageTemplateForm.controls; }


  initalizeForm() {

    this.messageTemplateForm = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required]],
      description: [''],
      template: ['', [Validators.required]],
    });

  }

  
  ngOnInit() {

    this.initalizeForm();

    this
      .route
      .params
      .pipe(
        map(p => p.id),
        switchMap(id => {

          if (id === 'new') {
            this.formHeader = "New message template";
            return of(new MessageTemplate());
          }

          this.formHeader = "Edit message template";

          return this.messageTemplateService.findById(id);

        })
      )
      .subscribe(data => {

        this.feedback = null;

        this.messageTemplate = data;

        this.f['id'].setValue(this.messageTemplate.id);
        this.f['name'].setValue(this.messageTemplate.name);
        this.f['description'].setValue(this.messageTemplate.description);
        this.f['template'].setValue(JSON.stringify(this.messageTemplate.template));


        });
    

  }


  load(): void {
    this.messageTemplateService.load();
  }



  onSubmit() {

    const id = this.messageTemplateForm.get('id').value;

    const isCreate = id == null || id.length == 0 ? true : false;

    this.messageTemplateService.save(this.messageTemplateForm.value, isCreate).subscribe(
      messageTemplate => {
        this.messageTemplate = messageTemplate;
        this.feedback = { type: 'success', message: 'Save was successful!' };
        this.messageTemplateForm.reset();
        this.load();
        setTimeout(() => {
          this.feedback = null;
          this.router.navigate(['/messagetemplates']);
        }, 1000);
      }
    );

  }

  cancel() {
    this.router.navigate(['/messagetemplates']);
  }


}
