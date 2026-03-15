export interface Guest {
  registrant_id: string;
  event_id: string;
  users_id: string;
  terms_approval: boolean;
  form_answers: Record<string, string>;
  is_registered: boolean;
  is_going: boolean | null;
  check_in?: boolean;
  check_in_time?: string | null;
  qr_data: string | null;
  users: {
    first_name: string;
    last_name: string;
    email: string;
  } | null;
}

export interface GuestStats {
  totalRsvp: number;
  totalRegistered: number;
  checkedIn: number;
  waitlist: number;
  notGoing: number;
}
