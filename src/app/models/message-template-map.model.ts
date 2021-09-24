import { Audit } from './audit.model';

export class MessageTemplateMap extends Audit{
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
  mappings: MapTemplate[];
}

export class MessageAttributeMap extends Audit{

  id: string;
  messageTemplateMapId: string;
  sourceMessageAttributes: MessageAttributeMapSource[];
  function: string;
  clientFunction: string;
  targetMessageAttributeId: any;
  targetMessageAttributeName: string;
  inactive: boolean;

}

export class MessageAttributeMapSource extends Audit{

  id: string;
  messageAttributeMapId: string;
  sourceMessageAttributeId: string;
  sourceMessageAttributeName: string;

}

export class MapTemplate{
  sources: source[];
  client_function: string;
  function: string;
  inactive: string;
  target: string;
}

export class source {
  source: string;
}
