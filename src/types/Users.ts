import { Family } from "./family";

export interface User {
  id: number;
  created_at?: string;
  updated_at?: string;
  first_name: string;
  gift_suggestions: string[];
  has_been_drawn: boolean;
  already_drew: boolean;
  draw_result: User | null;
  excluded_users: number[];
  family: Family["id"];
}
