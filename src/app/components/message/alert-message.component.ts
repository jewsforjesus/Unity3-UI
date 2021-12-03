import { Component, OnInit } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { Page } from 'src/app/models/page.model';
import { AlertMessage } from 'src/app/models/alert-message.model';
import { AlertMessageService } from 'src/app/services/alert-message.service';

@Component({
  selector: 'app-alert-message',
  templateUrl: 'alert-message.component.html'
})
export class AlertMessageComponent implements OnInit {

  alertMessage: AlertMessage;

  feedback: any = null;

  get alertMessagesPageable(): Page<AlertMessage> {
    return this.alertMessageService.alertMessagesPageable;
  }

  constructor(    private formBuilder: FormBuilder, 
    private alertMessageService: AlertMessageService) {
  }

  ngOnInit() {

    this.load();
  }

  load(): void {
    this.alertMessageService.load();
    
  }

  delete(entity: AlertMessage): void {
    if (confirm('Are you sure?')) {
      this.alertMessageService.delete(entity).subscribe(() => {
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

