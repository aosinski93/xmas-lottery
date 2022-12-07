export interface User {
  id: number;
  first_name: string;
  gift_suggestions: string[];
  has_been_drawn: boolean;
  already_drew: boolean;
  draw_result: User | null;
  excluded_users: number[];
}
