import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MapTemplate, MessageTemplateMap } from 'src/app/models/message-template-map.model';
import { MessageTemplateMapService } from 'src/app/services/message-template-map.service';
import { MessageTemplate } from 'src/app/models/message-template.model';
import { MessageTemplateService } from 'src/app/services/message-template.service';

@Component({
  selector: 'app-message-template-map-edit',
  templateUrl: './message-template-map-edit.component.html'
})
export class MessageTemplateMapEditComponent implements OnInit {

  id: string;
  messageTemplateMap: MessageTemplateMap;
  templateId: string;

  messageTemplates: MessageTemplate[];

  sourcePath: string[];
  targetPath: string[];

  formHeader: String;

  feedback: any = null;

  messageTemplateMapForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageTemplateMapService: MessageTemplateMapService,
    private messageTemplateService: MessageTemplateService
  ) {
  }

  get f() { return this.messageTemplateMapForm.controls; }


  initalizeForm() {

    this.messageTemplateMapForm = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required]],
      description: [''],
      sourceMessageTemplateId: ['', [Validators.required]],
      targetMessageTemplateId: ['', [Validators.required]],
      clientScript: [''],
      mappings: this.formBuilder.array([]),
        
    });

  }

  mappings(): FormArray {
   return this.messageTemplateMapForm.get("mappings") as FormArray
  }

  newMapping(): FormGroup {
    return this.formBuilder.group({
      sources: this.formBuilder.array([]),
      client_function: [''],
      function: [''],
      inactive: [''],
      target: [''],
    })
  }

  addMapping() {
    this.mappings().push(this.newMapping());
  }

  removeMapping(mappingIndex: number) {
    this.mappings().removeAt(mappingIndex);
  }

  mappingSources(mappingIndex: number): FormArray {
    return this.mappings().at(mappingIndex).get("sources") as FormArray
  }

  newSource(): FormGroup {
    return this.formBuilder.group({
      source: [''],
    })
  }

  addMappingSource(mappingIndex: number) {
    this.mappingSources(mappingIndex).push(this.newSource());
  }

  removeMappingSource(mappingIndex: number, sourceIndex: number) {
    this.mappingSources(mappingIndex).removeAt(sourceIndex);
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
            this.messageTemplateMap = new MessageTemplateMap();
            return of(this.messageTemplateMap);
          }

          this.formHeader = "Edit message template";

          return this.messageTemplateMapService.findById(id);

        })
      )
      .subscribe(data => {

        this.feedback = null;

        this.messageTemplateMap = data;

        this.f['id'].setValue(this.messageTemplateMap.id);
        this.f['name'].setValue(this.messageTemplateMap.name);
        this.f['description'].setValue(this.messageTemplateMap.description);
        this.f['sourceMessageTemplateId'].setValue(this.messageTemplateMap.sourceMessageTemplateId);
        this.f['targetMessageTemplateId'].setValue(this.messageTemplateMap.targetMessageTemplateId);
        this.f['clientScript'].setValue(this.messageTemplateMap.clientScript);

       
          
        if (data.mappings == null) {
          
          this.newMapping();

        }
        else {

          this.sourcePathLookup(this.messageTemplateMap.sourceMessageTemplateId);
          this.targetPathLookup(this.messageTemplateMap.targetMessageTemplateId);

          data.mappings.forEach(m => {

            var mapping: FormGroup = this.formBuilder.group({
              sources: this.formBuilder.array([]),
              client_function: [m.client_function],
              function: [m.function],
              inactive: [m.inactive],
              target: [m.target],
            });

            this.mappings().push(mapping);

            m.sources.forEach(s => {
            
              var source: FormGroup = this.formBuilder.group({
                source: [s.source],
              });

              (mapping.get("sources") as FormArray).push(source);


            })



          });

        }
      
      }

    );
    
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

  sourcePathLookup(id): void {
    this.messageTemplateService.loadPath(id).subscribe(result => {
      this.sourcePath = null;
      this.sourcePath = result;
    });
  }


  targetPathLookup(id): void {
    this.messageTemplateService.loadPath(id).subscribe(result => {
      this.targetPath = null;
      this.targetPath = result;
    });
  }

  refreshSourcePathList(id): void {

    if (id != null) {
      this.sourcePathLookup(id.substring(3));
    }

  }


  refreshTargetPathList(id): void {

    if (id != null) {
      this.targetPathLookup(id.substring(3));
    }

  }


  onSubmit() {

    const id = this.messageTemplateMapForm.get('id').value;

    const isCreate = id == null || id.length == 0 ? true : false;

    this.messageTemplateMapService.save(this.messageTemplateMapForm.value, isCreate).subscribe(
      messageTemplate => {
        this.messageTemplateMap = messageTemplate;
        this.feedback = { type: 'success', message: 'Save was successful!' };
        this.messageTemplateMapForm.reset();
        this.load();
        setTimeout(() => {
          this.feedback = null;
          this.router.navigate(['/messagetemplatemaps']);
        }, 1000);
      }
    );

  }

  cancel() {
    this.router.navigate(['/messagetemplatemaps']);
  }


}
