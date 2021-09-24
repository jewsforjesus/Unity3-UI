import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OktaCallbackComponent, OktaAuthGuard } from '@okta/okta-angular';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { OKTA_CONFIG, OktaAuthModule } from '@okta/okta-angular';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { environment } from 'src/environments/environment';
import { HomeComponent } from './components/home/home.component';
import { ConnectorListComponent } from './components/connector/connector.component';
import { TraceComponent } from './components/trace/trace.component';
import { TraceInstanceListComponent } from './components/trace/trace-instance-list.component';
import { TraceListComponent } from './components/trace/trace-list.component';
import { LookupGroupComponent } from './components/lookup/lookup-group.component';
import { AppInfoComponent } from './components/about/app-info.component';
import { ConnectorSettingComponent } from './components/connector/connector-setting.component';
import { LookupComponent } from './components/lookup/lookup.component';
import { MessageTemplateMapComponent } from './components/mapping-template/message-template-map.component';
import { MessageTemplateComponent } from './components/message-template/message-template.component';
import { EventTemplateComponent } from './components/event/event-template.component';
import { EventMessageComponent } from './components/event/event-message.component';
import { EventMessageEditComponent } from './components/event/event-message-edit.component';
import { EventTemplateEditComponent } from './components/event/event-template-edit.component';
import { MessageTemplateMapEditComponent } from './components/mapping-template/message-template-map-edit.component';
import { MessageTemplateEditComponent } from './components/message-template/message-template-edit.component';

const oktaConfig = {
  issuer: environment.issuer,
  redirectUri: environment.redirectUri,
  clientId: environment.clientId,
  scopes: environment.scopes
};

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [OktaAuthGuard]
  },
  {
    path: 'callback',
    component: OktaCallbackComponent
  }
  ,
  {
    path: 'connectors',
    component: ConnectorListComponent,
    canActivate: [OktaAuthGuard]
  },
  {
    path: 'connectorsettings/:connectorId',
    component: ConnectorSettingComponent,
    canActivate: [OktaAuthGuard]
  },
  {
    path: 'lookupgroups',
    component: LookupGroupComponent,
    canActivate: [OktaAuthGuard]
  },
  {
    path: 'lookups/:lookupGroupId',
    component: LookupComponent,
    canActivate: [OktaAuthGuard]
  },
  {
    path: 'messagetemplates',
    component:  MessageTemplateComponent,
    canActivate: [OktaAuthGuard]
  },
  {
    path: 'messagetemplates/:id',
    component: MessageTemplateEditComponent,
    canActivate: [OktaAuthGuard]
  },
  {
    path: 'messagetemplatemaps',
    component:  MessageTemplateMapComponent,
    canActivate: [OktaAuthGuard]
  },
  {
    path: 'messagetemplatemaps/:id',
    component: MessageTemplateMapEditComponent,
    canActivate: [OktaAuthGuard]
  },
   {
     path: 'eventtemplates',
    component: EventTemplateComponent,
    canActivate: [OktaAuthGuard]
  },
  {
    path: 'eventtemplates/:id',
   component: EventTemplateEditComponent,
   canActivate: [OktaAuthGuard]
 },
  {
    path: 'eventmessages',
    component: EventMessageComponent,
    canActivate: [OktaAuthGuard]
  },
  {
    path: 'eventmessages/:id',
    component: EventMessageEditComponent,
    canActivate: [OktaAuthGuard]
  },
   {
    path: 'traces/:id',
    component: TraceComponent,
    canActivate: [OktaAuthGuard]
  },
  {
    path: 'traces/event/:eventId',
    component: TraceInstanceListComponent,
    canActivate: [OktaAuthGuard]
  },
  {
    path: 'traces/job/:jobId',
    component: TraceInstanceListComponent,
    canActivate: [OktaAuthGuard]
  },
  {
    path: 'traces/instance/:instanceId',
    component: TraceListComponent,
    canActivate: [OktaAuthGuard]
  },
  {
    path: 'appinfo',
    component: AppInfoComponent,
    canActivate: [OktaAuthGuard]
  }
  
];

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    OktaAuthModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    { provide: OKTA_CONFIG, useValue: oktaConfig },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
