import { Button, Dialog } from "heroui-native";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmDeleteItemModal = ({ open, onClose, onConfirm }: Props) => {
  const { t } = useTranslation();

  return (
    <Dialog isOpen={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content>
          <Dialog.Close className="self-end mb-2 z-50" />
          <View className="mb-8 gap-2">
            <Dialog.Title>{t("items.delete.title")}</Dialog.Title>
            <Dialog.Description>{t("items.delete.message")}</Dialog.Description>
          </View>
          <View className="flex-row justify-end">
            <Button variant="primary" onPress={onConfirm}>
              {t("common.confirm")}
            </Button>
          </View>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
};
