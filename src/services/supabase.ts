import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_KEY } from "./credentials";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const resetUsersTable = async () => {
  try {
    await supabase
      .from("users")
      .update({
        has_been_drawn: false,
        already_drew: false,
        draw_result: null,
      })
      .lt("created_at", new Date().toISOString());
  } catch (error) {
    console.log(error);
  }
};
