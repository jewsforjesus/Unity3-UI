import { Component,  OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertService } from '../services/alert.service';
import { Alert } from '../models/alert.model';


@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html'
})
export class AlertComponent implements OnDestroy {

  alerts: Alert[]=[];
  
  subscription: Subscription;

  constructor(private alertService: AlertService
    , private changeDetection: ChangeDetectorRef) {
    
            // subscribe to home component messages
            this.subscription = this.alertService.alert.subscribe(message => {

              if (message) {
                this.alerts.push(message);
                this.changeDetection.detectChanges();
              } else {
                // clear messages when empty message received
                this.alerts = [];
                //this.changeDetection.detectChanges();
              }
        
        
            });

  }

  close(alert: Alert) {
    this.alerts.splice(this.alerts.indexOf(alert), 1);
    this.changeDetection.detectChanges();
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
}

}
