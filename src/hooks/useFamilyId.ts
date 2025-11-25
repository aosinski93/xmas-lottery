import { useEffect } from "react";

export const useFamilyId = () => {
  const params = new URLSearchParams(window.location.search);
  const familyId = params.get("family") ?? "";

  useEffect(() => {
    if (!familyId) {
      window.location.search = "?family=1";
    }
  }, [familyId]);

  return familyId;
};
