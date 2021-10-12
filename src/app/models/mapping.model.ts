import { Audit } from './audit.model';

export class Mapping extends Audit{
  id: string;
  name: string;
  description: string;
  sourceMessageTemplateId: string;
  sourceMessageTemplateName: string;
  sourceMessageKeyAttributeId: string;
  targetMessageRelationshipAttributeId: string;
  targetMessageTemplateId: string;
  targetMessageTemplateName: string;
  clientScript: string;
  transformClassPath: string;
  joinKeySource: string;
  joinKeyTarget: string;
  mappings: MappingTemplate[];
}

export class MappingTemplate{
  sources: source[];
  client_function: string;
  function: string;
  inactive: string;
  target: string;
}

export class source {
  source: string;
}
