export interface Contact {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
}