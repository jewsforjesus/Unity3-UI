import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageTemplateMap } from 'src/app/models/message-template-map.model';
import { MessageAttribute, MessageTemplate } from 'src/app/models/message-template.model';
import { Page } from 'src/app/models/page.model';
import { MessageAttributeService } from 'src/app/services/message-attribute.service';
import { MessageTemplateMapService } from 'src/app/services/message-template-map.service';
import { MessageTemplateService } from 'src/app/services/message-template.service';

@Component({
  selector: 'app-message-template-mape',
  templateUrl: 'message-template-map.component.html'
})
export class MessageTemplateMapComponent implements OnInit {

  messageTemplateMap: MessageTemplateMap;

  messageTemplates: MessageTemplate[];

  sourceMessageAttributes: MessageAttribute[];
  targetMessageKAttributes: MessageAttribute[];

  feedback: any = null;

  get messageTemplateMapsPageable(): Page<MessageTemplateMap> {
    return this.messageTemplateMapService.messageTemplateMapPageable;
  }

  constructor(private formBuilder: FormBuilder, 
    private route: ActivatedRoute,
    private router: Router,
    private messageTemplateMapService: MessageTemplateMapService,
    private messageTemplateService: MessageTemplateService,
    private messageAttributeService: MessageAttributeService) {
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


  delete(entity: MessageTemplateMap): void {
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

  setForEdit(entity: MessageTemplateMap){

    if (confirm('Are you sure?')) {

      this.f['id'].setValue(entity.id);
      this.f['name'].setValue(entity.name);
      this.f['description'].setValue(entity.description);
      this.f['sourceMessageTemplateId'].setValue(entity.sourceMessageTemplateId);
      this.f['targetMessageTemplateId'].setValue(entity.targetMessageTemplateId);
      this.f['clientScript'].setValue(entity.clientScript);
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

