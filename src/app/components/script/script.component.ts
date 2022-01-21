import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Script } from 'src/app/models/script.model';
import { Page } from 'src/app/models/page.model';
import { ScriptService } from 'src/app/services/script.service';

@Component({
  selector: 'app-script',
  templateUrl: 'script.component.html'
})
export class ScriptComponent implements OnInit {

  script: Script;

  feedback: any = null;

  get scriptsPageable(): Page<Script> {
    return this.scriptService.scriptsPageable;
  }

  constructor(    private formBuilder: FormBuilder, 
    private scriptService: ScriptService) {
  }

  ngOnInit() {

    this.load();
  }

  load(): void {
    this.scriptService.load();
    
  }

  delete(entity: Script): void {
    if (confirm('Are you sure?')) {
      this.scriptService.delete(entity).subscribe(() => {
          this.feedback = {type: 'success', message: 'Delete was successful!'};
          setTimeout(() => {
            this.load();
            this.feedback = null;
          }, 1000);
         }
      );
    }
  }
 
  

}

