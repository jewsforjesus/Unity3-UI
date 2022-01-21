import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Mapping } from 'src/app/models/mapping.model';
import { Template } from 'src/app/models/template.model';
import { Page } from 'src/app/models/page.model';
import { TemplateService } from 'src/app/services/template.service';
import { MappingService } from 'src/app/services/mapping.service';

@Component({
  selector: 'app-mapping',
  templateUrl: 'mapping.component.html'
})
export class MappingComponent implements OnInit {

  messageTemplateMap: Mapping;

  messageTemplates: Template[];


  feedback: any = null;

  get messageTemplateMapsPageable(): Page<Mapping> {
    return this.messageTemplateMapService.messageTemplateMapPageable;
  }

  constructor(private formBuilder: FormBuilder, 
    private messageTemplateMapService: MappingService,
    private messageTemplateService: TemplateService) {
  }

  messageTemplateMapForm = new FormGroup({
    id: new FormControl(''),
    name: new FormControl(''),
    description: new FormControl(''),
    sourceMessageTemplateId: new FormControl(''),
    targetMessageTemplateId: new FormControl(''),
    clientScript: new FormControl(''),
    template: new FormControl(''),
  });

  get f() { return this.messageTemplateMapForm.controls; }

  ngOnInit() {

    this.messageTemplateMapForm = this.formBuilder.group({
      id: [''],
      name: ['',[Validators.required]],
      description: [''],
      sourceMessageTemplateId: ['',[Validators.required]],
      targetMessageTemplateId: ['',[Validators.required]],
      clientScript: [''],
      template: ['', [Validators.required]],
    });

    this.load();

    this.loadMessageTemplateLookup();
  }

  load(): void {
    this.messageTemplateMapService.load();
  }

  
  loadMessageTemplateLookup(): void {
    this.messageTemplateService.lookup().subscribe(result => {
      this.messageTemplates = result;
    });
  }


  delete(entity: Mapping): void {
    if (confirm('Are you sure?')) {
      this.messageTemplateMapService.delete(entity).subscribe(() => {
          this.feedback = {type: 'success', message: 'Delete was successful!'};
          setTimeout(() => {
            this.load();
            this.feedback = null;
          }, 1000);
         }
      );
    }
  }

  setForEdit(entity: Mapping){

    if (confirm('Are you sure?')) {

      this.f['id'].setValue(entity.id);
      this.f['name'].setValue(entity.name);
      this.f['description'].setValue(entity.description);
      this.f['sourceMessageTemplateId'].setValue(entity.sourceMessageTemplateId);
      this.f['targetMessageTemplateId'].setValue(entity.targetMessageTemplateId);
      this.f['mappings'].setValue(entity.mappings);
    }

  }

  onSubmit(){

    const id = this.messageTemplateMapForm.get('id').value;

    const isCreate = id == null || id.length == 0 ? true : false;
    
        this.messageTemplateMapService.save(this.messageTemplateMapForm.value, isCreate ).subscribe(
          messageTemplate => {
          this.messageTemplateMap = messageTemplate;
          this.feedback = {type: 'success', message: 'Save was successful!'};
          this.messageTemplateMapForm.reset();
          this.load();
          setTimeout(() => {
            this.feedback = null;
          }, 1000);
        }
      );

  }

  clearForm(){
    this.messageTemplateMapForm.reset();
  }

  

}

