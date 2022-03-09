import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Template } from 'src/app/models/template.model';
import { Page } from 'src/app/models/page.model';
import { TemplateService } from 'src/app/services/template.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-template',
  templateUrl: 'template.component.html'
})
export class TemplateComponent implements OnInit {

  messageTemplate: Template;

  feedback: any = null;

  get messageTemplatesPageable(): Page<Template> {
    return this.messageTemplateService.messageTemplatePageable;
  }

  constructor(    private formBuilder: FormBuilder, 
    private router: Router,
    private messageTemplateService: TemplateService) {
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

  delete(entity: Template): void {
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
          //this.load();
          this.router.navigate(['/templates/',this.messageTemplate.id]);
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

