export type RenderedEmail = {
  to: string;
  name?: string;
  subject?: string;
  html: string;
};

export type RecipientScope = "all" | "registered" | "pending";
