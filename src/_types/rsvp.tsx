export enum RsvpStatus {
  accepted = "Accepted",
  awaiting = "Awaiting response",
  declined = "Declined"
}

export type FormState = {
  name: string;
  email: string;
  phone: string;
  invited?: string;
  status: RsvpStatus;
  notes: string;
  dietary: string;
  token?: string;
};
