export type NotificationTemplate = {
  id: number;
  templateId: string; // uuid
  name: string;
  channelType: ChannelType;
  channels: Channels;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type ChannelType = {
  SMS: string; // e.g., "LOCAL"
  EMAIL: string; // e.g., "TWILIO"
  PUSH: string; // e.g., "LOCAL"
};

export type Channels = {
  SMS: ChannelDetails<SMSChannel>;
  PUSH: ChannelDetails<PUSHChannel>;
  EMAIL: ChannelDetails<EMAILChannel>;
};

export type ChannelDetails<T> = {
  content: T; // Content can be either string or an object for PUSH/EMAIL
  variables: string[]; // Array of variable names
  isActive: boolean;
};

export type SMSChannel = string;

export type PUSHChannel = {
  title?: string; // Only applicable for PUSH
  subTitle?: string;
};
export type EMAILChannel = {
  subject: string; // Only applicable for EMAIL
  body?: string; // Only applicable for EMAIL
  templateName?: string; // Optional for EMAIL
};
