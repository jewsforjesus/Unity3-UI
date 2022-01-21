import { Audit } from './audit.model';

export class RouteLog extends Audit {
  id: string;
  messageId: string;
  info: string;
  data: string;
}



