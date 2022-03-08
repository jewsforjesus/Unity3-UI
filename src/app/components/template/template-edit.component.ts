import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Field, Template } from 'src/app/models/template.model';
import { TemplateService } from 'src/app/services/template.service';

@Component({
  selector: 'app-template-edit',
  templateUrl: 'template-edit.component.html',
  styleUrls: ['./tree-view.css']
})
export class TemplateEditComponent implements OnInit {

  id: string;

  messageTemplate: Template;

  selectedTreeNode: Field | null;

  dataTypes: string[] = ['string','number','object','boolean','array'];

  newName: string;
  newType: string;

  updatedName: string;

  action: string = null;

  templateId: string;

  formHeader: String;

  feedback: any = null;


  messageTemplateForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageTemplateService: TemplateService
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
            this.formHeader = "New template";
            return of(new Template());
          }

          this.formHeader = "Edit template";

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


  public selectNode( node: Field ) : void {
 
    if(this.selectedTreeNode == null){
      this.selectedTreeNode = node;
    }
    else{
      this.selectedTreeNode = null;
    }



	}

  changeAction(node, action:string){

    this.selectedTreeNode = node;
    
    this.action = action.toUpperCase();

  }


  preOrderTraversal = function(node: Field){
              
    if(!node) return;

    //console.log(node.name  );
    
    if(node.fields != null){

      node.fields.forEach(f=>{

        f.parent = node;

        //console.log(f.parent.name + " - " + f.name  );

        if(f.fields != null){
          this.preOrderTraversal(f);
        }

      });

    }

  }

  public updateNode(selectedNode: Field ) : void {

    let field = new Field();

    //copy to new var to avoid current node show updated value which is not sent to api yet.
    field.path = selectedNode.path;
    field.name = this.updatedName;
    field.type = selectedNode.type;

    this.feedback = { type: 'info', message: 'Saving' };

    this.messageTemplateService.editField(this.messageTemplate.id, field.path, field).subscribe(result => {

      this.messageTemplate = result;

      this.f['template'].setValue(JSON.stringify(this.messageTemplate.template));

      this.feedback = null;

    });

    this.action = null;
    this.selectedTreeNode = null;
    this.updatedName = null;
 
	}

  selectedType(event: any) {
    //update the ui
    this.selectedTreeNode.type = event.target.value;

  }


  deleteNode(selectedNode: Field): void{

    if (confirm('Are you sure?')) {

    this.feedback = { type: 'info', message: 'Saving' };

    this.messageTemplateService.deleteField(this.messageTemplate.id, selectedNode.path).subscribe(result => {

      this.messageTemplate = result;

      this.f['template'].setValue(JSON.stringify(this.messageTemplate.template));

      this.feedback = null;

    });


  }

  }

  addNode(selectedNode: Field): void {

    let field = new Field();

    field.name = this.newName;
    field.type = this.newType == null ? 'string' : this.newType;

    this.feedback = { type: 'info', message: 'Saving' };

    this.messageTemplateService.addField(this.messageTemplate.id, selectedNode.path, field).subscribe(result => {

      this.messageTemplate = result;

      this.f['template'].setValue(JSON.stringify(this.messageTemplate.template));

      this.feedback = null;

    });

      this.newName = null;
      this.newType = null;


      //hide add form
      this.action = null;
      this.selectedTreeNode = null;
 
	}




  load(): void {
    this.messageTemplateService.load();
  }



  onSubmit() {

    this.f['template'].setValue(JSON.stringify(this.messageTemplate.template));

    const id = this.messageTemplateForm.get('id').value;

    const isCreate = id == null || id.length == 0 ? true : false;

    //let field: Field = JSON.parse(this.messageTemplateForm.get('template').value);

    this.f['template'].setValue(this.messageTemplateForm.get('template').value);

    this.messageTemplateService.save(this.messageTemplateForm.value, isCreate).subscribe(
      messageTemplate => {
        this.messageTemplate = messageTemplate;
        this.feedback = { type: 'success', message: 'Save was successful!' };
        this.messageTemplateForm.reset();
        this.load();
        setTimeout(() => {
          this.feedback = null;
          this.router.navigate(['/templates']);
        }, 1000);
      }
    );

  }

  cancel() {
    this.router.navigate(['/templates']);
  }


}
