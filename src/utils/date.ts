import { isValid, parseISO } from "date-fns";

export const parseIsoDate = (isoDate?: string | null) => {
  if (!isoDate) return null;

  const d = parseISO(isoDate);
  return isValid(d) ? d : null;
};
