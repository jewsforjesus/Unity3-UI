import { Audit } from "./audit.model";

export class Connector extends Audit {
  id: string;
  name: string;
  description: string;
  connectorLibraryId: string;
  connectorLibraryName: string;
}

export class ConnectorSetting extends Audit{
  id: string;
  connectorId: string;
  profile: string[];
  key: string;
  value: string;
  secret: boolean;
}

