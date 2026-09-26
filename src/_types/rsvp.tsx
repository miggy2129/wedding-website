export enum RsvpStatus {
  accepted = "Accepted",
  awaiting = "Awaiting response",
  declined = "Declined"
}

export type FormState = {
  name: string;
  email: string;
  phone: string;
  status: RsvpStatus;
  notes: string;
  dietary: string;
};

export type GroupMember = {
  id: string;
  name: string;
  status: RsvpStatus | null;
};

export type GroupUpdate = {
  id: string;
  status: RsvpStatus | null;
  email: string;
  phone: string;
  dietary: string;
};

export type RsvpResult = {
  success: boolean;
  status?: number;
  message: string;
  members?: GroupMember[];
  updatedOthers?: number;
};
