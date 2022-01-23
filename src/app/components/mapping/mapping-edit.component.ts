import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Mapping } from 'src/app/models/mapping.model';
import { Template } from 'src/app/models/template.model';
import { TemplateService } from 'src/app/services/template.service';
import { KeyValuePair } from 'src/app/models/key-value-pair.model';
import { MappingService } from 'src/app/services/mapping.service';
import { NgbActiveModal, NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { ScriptService } from 'src/app/services/script.service';

@Component({
  selector: 'mapping-edit',
  templateUrl: './mapping-edit.component.html'
})
export class MappingEditComponent implements OnInit {

  id: string;
  messageTemplateMap: Mapping;
  templateId: string;

  transformClassLookup: KeyValuePair[];
  transformFunctionLookup: KeyValuePair[];

  transformScriptLookup: KeyValuePair[];

  messageTemplates: Template[];

  sourcePath: string[];
  targetPath: string[];

  formHeader: String;

  feedback: any = null;

  messageTemplateMapForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageTemplateMapService: MappingService,
    private messageTemplateService: TemplateService,
    private modalService: NgbModal,
    private scriptService: ScriptService
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
      transformClassPath: [],
      transformScriptId: [null],
      joinKeySource: [''],
      joinKeyTarget:[''],
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
      emptyStringToNull: [null],
      nullToEmptyString: [null],
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

    this.messageTemplateMapService.loadClasses("Transform").subscribe(
      result => {
        this.transformClassLookup = result
      }
    );



    this.initalizeForm();

    

    this
      .route
      .params
      .pipe(
        map(p => p.id),
        switchMap(id => {

          if (id === 'new') {
            this.formHeader = "New mapping";
            this.messageTemplateMap = new Mapping();
            return of(this.messageTemplateMap);
          }

          this.formHeader = "Edit mapping";

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
        this.f['transformScriptId'].setValue(this.messageTemplateMap.transformScriptId);
        this.f['transformClassPath'].setValue(this.messageTemplateMap.transformClassPath);
        this.f['joinKeySource'].setValue(this.messageTemplateMap.joinKeySource);
        this.f['joinKeyTarget'].setValue(this.messageTemplateMap.joinKeyTarget);
          
        if (data.mappings == null) {
          
          this.newMapping();

        }
        else {

          this.sourcePathLookup(this.messageTemplateMap.sourceMessageTemplateId, this.messageTemplateMap.targetMessageTemplateId);
          //this.targetPathLookup(this.messageTemplateMap.targetMessageTemplateId);
          this.loadTransformFunctionLookup(this.messageTemplateMap.transformClassPath);

          //load mappings once lookps finish loading
          data.mappings.forEach(m => {

            var mapping: FormGroup = this.formBuilder.group({
              sources: this.formBuilder.array([]),
              client_function: [m.client_function],
              function: [m.function],
              inactive: [m.inactive],
              target: [m.target],
              emptyStringToNull: [m.emptyStringToNull],
              nullToEmptyString: [m.nullToEmptyString],
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

    this.loadTransformScriptLookup();


  }


  load(): void {
    this.messageTemplateMapService.load();
  }

  loadTransformScriptLookup(): void {
    this.scriptService.lookup().subscribe(result => {
      this.transformScriptLookup = result;
    });
  }

  loadMessageTemplateLookup(): void {
    this.messageTemplateService.lookup().subscribe(result => {
      this.messageTemplates = result;
    });
  }

  sourcePathLookup(id, targetId): void {
    this.messageTemplateService.loadPath(id).subscribe(result => {
      this.sourcePath = null;
      this.sourcePath = result;

      this.targetPathLookup(targetId);
    });
  }


  targetPathLookup(id): void {
    this.messageTemplateService.loadPath(id).subscribe(result => {
      this.targetPath = null;
      this.targetPath = result;
    });
  }

  loadTransformFunctionLookup(className:string) {

    this.messageTemplateMapService.loadMethods(className).subscribe(
      result => {
        this.transformFunctionLookup = result
      }
    );

  }

  refreshPathList(id, targetId): void {

    if (id != null) {
      this.sourcePathLookup(id.substring(3), targetId.substring(3));
    }

  }


  refreshTargetPathList(id): void {

    if (id != null) {
      this.targetPathLookup(id.substring(3));
    }

  }

  closeResult = '';

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
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
          this.router.navigate(['/mappings']);
        }, 1000);
      }
    );

  }

  cancel() {
    this.router.navigate(['/mappings']);
  }


}
