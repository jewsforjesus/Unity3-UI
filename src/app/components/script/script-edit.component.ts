import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ScriptService } from 'src/app/services/script.service';
import { Script } from 'src/app/models/script.model';
import { KeyValuePair } from 'src/app/models/key-value-pair.model';

@Component({
  selector: 'app-script-edit',
  templateUrl: 'script-edit.component.html'
})
export class ScriptEditComponent implements OnInit {

  id: string;

  scriptLookup: KeyValuePair[];

  script: Script;

  scriptId: string;

  formHeader: String;

  feedback: any = null;

  scriptForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private scriptService: ScriptService
  ) {
  }

  get f() { return this.scriptForm.controls; }


  initalizeForm() {

    this.scriptForm = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required]],
      description: [''],
      importedScriptIDs: this.formBuilder.array([
        this.formBuilder.control([''])
      ]),
      script: ['', [Validators.required]],
      isCustomizable: [false],
    });

  }

  importedScriptIDs(): FormArray {
    return this.scriptForm.get("importedScriptIDs") as FormArray
  }
  
  ngOnInit() {

    this.initalizeForm();

    this.scriptService.lookup().subscribe(
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
            this.formHeader = "New script";
            return of(new Script());
          }

          this.formHeader = "Edit script";

          return this.scriptService.findById(id);

        })
      )
      .subscribe(data => {

        this.feedback = null;

        this.script = data;

        this.f['id'].setValue(this.script.id);
        this.f['name'].setValue(this.script.name);
        this.f['description'].setValue(this.script.description);

        this.importedScriptIDs().clear();
        if (this.script.importedScriptIDs) {
          this.script.importedScriptIDs.forEach(element => {
            this.importedScriptIDs().push(this.formBuilder.control(element));
          });
        }

        this.f['script'].setValue(this.script.script);
        this.f['isCustomizable'].setValue(this.script.isCustomizable);


        });
    

  }

  addImportedScript() {
    this.importedScriptIDs().push(this.formBuilder.control(['']));
  }

  removeImportedScript(index: number) {
    this.importedScriptIDs().removeAt(index);
  }


  load(): void {
    this.scriptService.load();
  }



  onSubmit() {

    const id = this.scriptForm.get('id').value;

    const isCreate = id == null || id.length == 0 ? true : false;

    this.scriptService.save(this.scriptForm.value, isCreate).subscribe(
      script => {
        this.script = script;
        this.feedback = { type: 'success', message: 'Save was successful!' };
        this.scriptForm.reset();
        this.load();
        setTimeout(() => {
          this.feedback = null;
          this.router.navigate(['/scripts']);
        }, 1000);
      }
    );

  }

  cancel() {
    this.router.navigate(['/scripts']);
  }


}
