export enum RsvpStatus {
  accepted = "Accepted",
  awaiting = "Awaiting response",
  declined = "Declined"
}

// Guest-facing labels, shared by the main RSVP form and the group dialog.
export const rsvpStatusLabels = {
  [RsvpStatus.accepted]: "Attending",
  [RsvpStatus.declined]: "Not attending",
} as const;

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
  group?: { token: string; count: number };
  members?: GroupMember[];
  updatedOthers?: number;
};
