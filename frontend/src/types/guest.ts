export interface Guest {
  registrant_id: string;
  event_id: string;
  email: string;
  first_name: string;
  last_name: string;
  terms_approval: boolean;
  form_answers: Record<string, string> | null;
  is_registered: boolean;
}

export interface GuestStats {
  totalRegistered: number;
  going: number;
  checkedIn: number;
  waitlist: number;
}
