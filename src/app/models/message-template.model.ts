import { Audit } from './audit.model';

export class MessageTemplate extends Audit {
  id: string;
  name: string;
  description: string;
  template: object;
}

export class MessageAttribute extends Audit{

  id: string;
  messageTemplateId: string;
  name: string;
  dataType: string;
  defaultValue: any;
  depth: number;

}




