import { Component, OnInit } from '@angular/core';
import { Page } from 'src/app/models/page.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { MessageWrapper } from 'src/app/models/message-wrapper.model';
import { QueueService } from 'src/app/services/message.service';
import { Message } from 'src/app/models/message.model';
import { MessageWrapperService } from 'src/app/services/message-wrapper.service';
import { of } from 'rxjs';

@Component({
  selector: 'app-message-wrapper',
  templateUrl: 'message-wrapper.component.html'
})
export class MessageWrapperComponent implements OnInit {

  messageQueue: Message;

  get messageWrapperPageable(): Page<MessageWrapper> {
    return this.messageWrapperService.messageWrapperPageable;
  }

  queueId: string;

  feedback: any = null;

  currentPage: number = 1;

  messageWrapperForm = new FormGroup({
    id: new FormControl(''),
    queueId: new FormControl(''),
    partitionNumber: new FormControl(''),
    message: new FormControl(''),
    errorMessage: new FormControl(''),
    status: new FormControl(''),
    flag: new FormControl('')
  });

  get eventMessagesPageable(): Page<MessageWrapper> {
    return this.messageWrapperService.messageWrapperPageable;
  }

 get f() { return this.messageWrapperForm.controls; }

  initalizeForm(queueId: string){
  
    this.messageWrapperForm = this.formBuilder.group({
      id: [null],
      queueId: [queueId],
      partitionNumber: [0],
      message: ['',[Validators.required]],
      errorMessage: [null],
      status: [null],
      flag: [null],
    });
  
   }

  constructor(    private formBuilder: FormBuilder, 
    private route: ActivatedRoute,
    private messageWrapperService: MessageWrapperService) {
  }

  reQueueForm = new FormGroup({
    status: new FormControl('')
  });


  ngOnInit() {


    this
      .route
      .params
      .pipe(
        map(p => p.queueId),
        switchMap(queueId => {

          this.initalizeForm(queueId);
          this.queueId = queueId;

          this.load(this.queueId);

          return of(new MessageWrapper());
        })
      ).subscribe(messageWrapper => {
        return of(new MessageWrapper());
      }
    );
  
    }

    load(queueId: string): void {
      this.messageWrapperService.load(queueId, this.currentPage);
    }

    loadPage(page: number) {
      this.messageWrapperService.load(this.queueId, this.currentPage);
    }


  edit(id){

  }


  delete(messageWrapper: MessageWrapper): void {
    if (confirm('Are you sure?')) {
      this.messageWrapperService.delete(messageWrapper).subscribe(() => {
          this.feedback = {type: 'success', message: 'Delete was successful!'};
          setTimeout(() => {
            this.load(this.queueId);
            this.feedback = null;
          }, 1000);
         }
      );
    }
  }

  clearForm(){

  }

  onSubmit() {

    if (confirm('Are you sure?')) {
    this.messageWrapperService.save(this.messageWrapperForm.value, true).subscribe(
      messageWrapper => {
        this.messageWrapperForm.reset();
        this.feedback = {type: 'success', message: 'Save was successful!'};
        setTimeout(() => {
          this.load(this.queueId);
          this.feedback = null;
        }, 1000);
      }
    );

    }

}

}

  

 








