import { Audit } from "./audit.model";

export class AlertMessage extends Audit {
  id:string;
  name:string;
  description:string;
  address:string;
  isText:string;
  message:string;
}



