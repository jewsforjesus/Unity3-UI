import { Audit } from './audit.model';

export class Template extends Audit {
  id: string;
  name: string;
  description: string;
  template: Field;
}

export class Field  {
  path: string;
  level: number;
  name: string;
  type: string;
  fields: Field[];
}





