import { useTranslation } from "react-i18next";
import { z } from "zod";

export const useNewItemSchema = () => {
  const { t } = useTranslation();

  return z.object({
    name: z
      .string()
      .nonempty(
        `${t("items.createModal.nameLabel")} ${t("common.isRequired")}`
      ),
  });
};
