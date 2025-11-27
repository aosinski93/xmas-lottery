import { supabase } from "../services/supabase";
import { useFamilyId } from "./useFamilyId";

export default function useSetDrawInProgress() {
  const familyId = useFamilyId();

  const setDrawInProgressTrue = async (username?: string) => {
    try {
      await supabase
        .from("utils")
        .update({
          draw_in_progress: true,
          user_drawing: username,
        })
        .eq("family", familyId);
    } catch (error) {
      console.log(error);
    }
  };

  const setDrawInProgressFalse = async () => {
    try {
      await supabase
        .from("utils")
        .update({ user_drawing: null, draw_in_progress: false })
        .eq("family", familyId);
    } catch (error) {
      console.log(error);
    }
  };

  return { setDrawInProgressTrue, setDrawInProgressFalse };
}
