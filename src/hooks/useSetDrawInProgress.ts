import { supabase } from "../services/supabase";
import { useFamilyId } from "./useFamilyId";

export default function useSetDrawResult() {
  const familyId = useFamilyId();

  const setDrawInProgressTrue = async (username?: string) => {
    try {
      await supabase.from("utils").insert({
        draw_in_progress: true,
        user_drawing: username,
        family: familyId,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const setDrawInProgressFalse = async () => {
    try {
      await supabase.from("utils").delete().eq("family", familyId);
    } catch (error) {
      console.log(error);
    }
  };

  return { setDrawInProgressTrue, setDrawInProgressFalse };
}
