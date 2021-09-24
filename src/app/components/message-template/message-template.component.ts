import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageTemplate } from 'src/app/models/message-template.model';
import { Page } from 'src/app/models/page.model';
import { MessageTemplateService } from 'src/app/services/message-template.service';

@Component({
  selector: 'app-message-template',
  templateUrl: 'message-template.component.html'
})
export class MessageTemplateComponent implements OnInit {

  messageTemplate: MessageTemplate;

  feedback: any = null;

  get messageTemplatesPageable(): Page<MessageTemplate> {
    return this.messageTemplateService.messageTemplatePageable;
  }

  constructor(    private formBuilder: FormBuilder, 
    private route: ActivatedRoute,
    private router: Router,
    private messageTemplateService: MessageTemplateService) {
  }

  messageTemplateForm = new FormGroup({
    id: new FormControl(''),
    name: new FormControl(''),
    description: new FormControl(''),
  });

  get f() { return this.messageTemplateForm.controls; }

  ngOnInit() {

    this.messageTemplateForm = this.formBuilder.group({
      id: [''],
      name: ['',[Validators.required]],
      description: ['']
    });

    this.load();
  }

  load(): void {
    this.messageTemplateService.load();
    
  }

  delete(entity: MessageTemplate): void {
    if (confirm('Are you sure?')) {
      this.messageTemplateService.delete(entity).subscribe(() => {
          this.feedback = {type: 'success', message: 'Delete was successful!'};
          setTimeout(() => {
            this.load();
            this.feedback = null;
          }, 1000);
         }
      );
    }
  }


  onSubmit(){

    const id = this.messageTemplateForm.get('id').value;

    const isCreate = id == null || id.length == 0 ? true : false;
    
        this.messageTemplateService.save(this.messageTemplateForm.value, isCreate ).subscribe(
          messageTemplate => {
          this.messageTemplate = messageTemplate;
          this.feedback = {type: 'success', message: 'Save was successful!'};
          this.messageTemplateForm.reset();
          this.load();
          setTimeout(() => {
            this.feedback = null;
          }, 1000);
        }
      );

  }

  clearForm(){
    this.messageTemplateForm.reset();
  }

  

}

