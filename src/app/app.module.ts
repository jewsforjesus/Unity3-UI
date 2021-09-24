import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { ChartsModule } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FileService } from './services/file.service';
import { HomeComponent } from './components/home/home.component';
import { LoaderService } from './services/loader.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoaderInterceptor } from './interceptors/loader.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { ErrorHandlerService } from './services/error-handler.service';
import { AlertComponent } from './shared/alert.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StatsService } from './services/stats.service';
import { ConnectorListComponent } from './components/connector/connector.component';
import { ConnectorService } from './services/connector.service';
import { JobService } from './services/job.service';
import { TraceService } from './services/trace.service';
import { TraceComponent } from './components/trace/trace.component';
import { TraceInstanceListComponent } from './components/trace/trace-instance-list.component';
import { TraceListComponent } from './components/trace/trace-list.component';
import { LookupGroupComponent } from './components/lookup/lookup-group.component';
import { LookupGroupService } from './services/lookup-group.service';
import { MessageTemplateService } from './services/message-template.service';
import { AppInfoService } from './services/app-info.service';
import { AppInfoComponent } from './components/about/app-info.component';
import { ConnectorSettingComponent } from './components/connector/connector-setting.component';
import { ConnectorSettingService } from './services/connector-setting.service';
import { LookupComponent } from './components/lookup/lookup.component';
import { LookupService } from './services/lookup.service';
import { MessageTemplateComponent } from './components/message-template/message-template.component';
import { MessageAttributeService } from './services/message-attribute.service';
import { MessageTemplateMapComponent } from './components/mapping-template/message-template-map.component';
import { MessageTemplateMapService } from './services/message-template-map.service';
import { MessageAttributeMapService } from './services/message-attribute-map.service';
import { EventTemplateComponent } from './components/event/event-template.component';
import { EventTemplateService } from './services/event-template.service';
import { EventMessageComponent } from './components/event/event-message.component';
import { EventMessageService } from './services/event-message.service';
import { EventMessageEditComponent } from './components/event/event-message-edit.component';
import { EventTemplateEditComponent } from './components/event/event-template-edit.component';
import { MessageTemplateMapEditComponent } from './components/mapping-template/message-template-map-edit.component';
import { MessageTemplateEditComponent } from './components/message-template/message-template-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AlertComponent,
    ConnectorListComponent,
    TraceInstanceListComponent,
    TraceComponent,
    TraceListComponent,
    LookupGroupComponent, 
    MessageTemplateComponent,
    AppInfoComponent,
    ConnectorSettingComponent,
    LookupComponent,
    MessageTemplateMapComponent,
    EventTemplateComponent,
    EventMessageComponent,
    EventMessageEditComponent,
    EventTemplateEditComponent,
    MessageTemplateMapEditComponent,
    MessageTemplateEditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    ChartsModule
  ],
  providers: [FileService,
    LoaderService,
    ErrorHandlerService,
    StatsService,
    ConnectorService,
    JobService,
    TraceService,
    LookupGroupService,
    MessageTemplateService,
    AppInfoService,
    ConnectorSettingService,
    LookupService,
    MessageAttributeService,
    MessageTemplateMapService,
    MessageAttributeMapService,
    EventTemplateService,
    JobService,
    EventMessageService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: ErrorHandler, useClass: ErrorHandlerService}],
  bootstrap: [AppComponent]
})
export class AppModule { }
