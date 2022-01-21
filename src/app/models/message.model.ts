import { Audit } from "./audit.model";

export class Message extends Audit {
  id: string;
  name: string;
  queue: string;
  routeId: string;
  status: string;
  description: string;
  startDate: string;
  endDate: string;
  duration: string;
  size: number;
  errorCount: number;
  successCount: number;
}



