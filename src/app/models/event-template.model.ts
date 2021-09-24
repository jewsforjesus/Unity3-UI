import { Audit } from './audit.model';
import { Connector } from './connector.model';

export class EventTemplate extends Audit {
  id: string;
  name: string;
  description: string;
  eventTemplateConnectors: EventTemplateConnector[];
  message: any;
  traceEnabled: string;
  inactive: boolean;
  triggerCount: number;
  size: number;
  routeDefinition: any;
  queueName: string;
  route: any;
}


export class EventTemplateConnector extends Audit{
  id: string;
  eventId: string;
  connectorId: string;
  connectorName: string;
  primaryConnector: Boolean;
  className: string;
}