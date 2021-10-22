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
import { ConnectorSettingComponent } from './components/connector/connector-setting.component';
import { LookupComponent } from './components/lookup/lookup.component';
import {  RouteComponent } from './components/route/route.component';
import { RouteEditComponent } from './components/route/route-edit.component';
import { AppSettingComponent } from './components/setting/app-setting.component';
import { TemplateComponent } from './components/template/template.component';
import { TemplateEditComponent } from './components/template/template-edit.component';
import { MappingComponent } from './components/mapping/mapping.component';
import { MappingEditComponent } from './components/mapping/mapping-edit.component';
import { MessageComponent } from './components/message/message.component';
import { MessageEditComponent } from './components/message/message-edit.component';

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
    path: 'templates',
    component:  TemplateComponent,
    canActivate: [OktaAuthGuard]
  },
  {
    path: 'templates/:id',
    component: TemplateEditComponent,
    canActivate: [OktaAuthGuard]
  },
  {
    path: 'mappings',
    component:  MappingComponent,
    canActivate: [OktaAuthGuard]
  },
  {
    path: 'mappings/:id',
    component: MappingEditComponent,
    canActivate: [OktaAuthGuard]
  },
   {
     path: 'routes',
    component: RouteComponent,
    canActivate: [OktaAuthGuard]
  },
  {
    path: 'routes/:id',
   component: RouteEditComponent,
   canActivate: [OktaAuthGuard]
 },
  {
    path: 'messages',
    component: MessageComponent,
    canActivate: [OktaAuthGuard]
  },
  {
    path: 'messages/:id',
    component: MessageEditComponent,
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
    path: 'appsettings',
    component: AppSettingComponent,
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
