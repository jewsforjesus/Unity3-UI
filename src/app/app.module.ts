import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { ChartsModule } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
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
import { TraceService } from './services/trace.service';
import { TraceComponent } from './components/trace/trace.component';
import { TraceInstanceListComponent } from './components/trace/trace-instance-list.component';
import { TraceListComponent } from './components/trace/trace-list.component';
import { LookupGroupComponent } from './components/lookup/lookup-group.component';
import { LookupGroupService } from './services/lookup-group.service';
import { TemplateService } from './services/template.service';
import { ConnectorSettingComponent } from './components/connector/connector-setting.component';
import { ConnectorSettingService } from './services/connector-setting.service';
import { LookupComponent } from './components/lookup/lookup.component';
import { LookupService } from './services/lookup.service';
import { AppSettingComponent } from './components/setting/app-setting.component';
import { AppSettingService } from './services/app-setting.service';
import { TemplateComponent } from './components/template/template.component';
import { TemplateEditComponent } from './components/template/template-edit.component';
import { MappingComponent } from './components/mapping/mapping.component';
import { MappingEditComponent } from './components/mapping/mapping-edit.component';
import { MappingService } from './services/mapping.service';
import { RouteComponent } from './components/event/route.component';
import { RouteEditComponent } from './components/event/route-edit.component';
import { RouteService } from './services/route.service';
import { QueueService } from './services/message.service';
import { MessageComponent } from './components/message/message.component';
import { MessageEditComponent } from './components/message/message-edit.component';

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
    TemplateComponent,
    AppSettingComponent,
    ConnectorSettingComponent,
    LookupComponent,
    MappingComponent,
    RouteComponent,
    MessageComponent,
    MessageEditComponent,
    RouteEditComponent,
    MappingEditComponent,
    TemplateEditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    ChartsModule
  ],
  providers: [
    LoaderService,
    ErrorHandlerService,
    StatsService,
    ConnectorService,
    TraceService,
    LookupGroupService,
    TemplateService,
    AppSettingService,
    ConnectorSettingService,
    LookupService,
    MappingService,
    RouteService,
    QueueService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: ErrorHandler, useClass: ErrorHandlerService}],
  bootstrap: [AppComponent]
})
export class AppModule { }
