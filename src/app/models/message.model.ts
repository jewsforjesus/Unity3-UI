import { Audit } from "./audit.model";

export class Message extends Audit {
  id: string;
  queueName: string;
  eventId: string;
  eventName: string;
  message: string;
  status: string;
  description: string;
  startDate: Date;
  endDate: Date;
  size: number;
  duration: number;
  dequeueCount: number;
  traceInstanceId: string;
}



