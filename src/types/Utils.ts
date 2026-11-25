import { Family } from "./family";

export interface Utils {
  id: string;
  user_drawing: string | null;
  draw_in_progress: boolean;
  family: Family["id"];
}
