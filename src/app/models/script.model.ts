import { Audit } from "./audit.model";
import { KeyValuePair } from "./key-value-pair.model";

export class Script extends Audit {
  id: string;
  name: string;
  description: string;
  importedScriptIDs: KeyValuePair[];
  script: string;
  tag: string;
}


