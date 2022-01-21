import { Audit } from "./audit.model";

export class MessageWrapper extends Audit {
  id: string;
  queueId: string;
  partitionNumber: number;
  message: string;
  errorMessage: string;
  status: string;
  flag: string;
}



