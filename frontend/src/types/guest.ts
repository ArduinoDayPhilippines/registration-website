export interface Guest {
  id: string;
  eventId: string;
  email: string;
  firstName: string;
  lastName: string;
  age?: string;
  mobileNumber?: string;
  occupation?: string;
  institution?: string;
  isPartnered?: "Yes" | "No";
  isOpenToScholarship?: "Yes" | "No";
  resumeUrl?: string;
  expectations?: string;
  suggestions?: string;
  status: "pending" | "approved" | "rejected" | "checked_in";
  createdAt: string;
  updatedAt?: string;
}

export interface GuestStats {
  totalRegistered: number;
  going: number;
  checkedIn: number;
  waitlist: number;
}
