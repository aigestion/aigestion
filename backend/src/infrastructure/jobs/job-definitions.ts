export type IJobData = Record<string, any>;

export enum JobName {
  EMAIL_SEND = 'email-send',
  DATA_PROCESSING = 'data-processing',
  SWARM_MISSION = 'swarm-mission',
  MALWARE_CLEANUP = 'malware-cleanup',
}

export interface IJobPayloads {
  [JobName.EMAIL_SEND]: {
    to: string;
    subject: string;
    body: string;
  };
  [JobName.DATA_PROCESSING]: {
    fileKey?: string;
    filePath?: string;
    originalname?: string;
    type?: string;
    requestId?: string;
  };
  [JobName.SWARM_MISSION]: {
    objective: string;
    userId: string;
    missionId: string;
    context?: any;
  };
  [JobName.MALWARE_CLEANUP]: Record<string, never>;
}
