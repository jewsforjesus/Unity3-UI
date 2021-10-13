import { Audit } from './audit.model';
import { Connector } from './connector.model';
import { KeyValuePair } from './key-value-pair.model';

export class Route extends Audit {
  id: string;
  name: string;
  description: string;
  message: any;
  traceEnabled: string;
  inactive: boolean;
  triggerCount: number;
  size: number;
  routeDefinition: any;
  queueName: string;
  route: any;
  messageTemplateMapIds: string[];
  connectorIds: string[];
  routeClassPath: string;
  chainedRoutes: string[];
}

