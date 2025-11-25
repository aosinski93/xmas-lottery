import { Family } from "./Family";

export interface Utils {
  id: string;
  user_drawing: string;
  draw_in_progress: boolean;
  family: Family["id"];
}
