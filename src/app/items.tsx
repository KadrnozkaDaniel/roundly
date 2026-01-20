import { Ionicons } from "@expo/vector-icons";
import { Button } from "heroui-native";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MedicationItem } from "../components/item/MedicationItem";
import { ConfirmDeleteItemModal } from "../components/item/modals/ConfirmDeleteItemModal";
import { CreateItemModal } from "../components/item/modals/CreateItemModal";
import { useItemsStore } from "../store/itemsStore";
import { Item } from "../types/item";
import { useModals } from "../utils/hooks/useModal";

export default function NewItemScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const itemDataRef = useRef<Item | null>(null);

  const [modals, openModal, closeModal] = useModals({
    add: false,
    delete: false,
  });

  const items = useItemsStore((s) => s.items);
  const archiveItem = useItemsStore((s) => s.archiveItem);
  const updateItem = useItemsStore((s) => s.updateItem);
  const deleteItem = useItemsStore((s) => s.deleteItem);

  const handleArchivedChange = (id: string, archived: boolean) => {
    if (archived) {
      archiveItem(id);
    } else {
      updateItem(id, { archived: false });
    }
  };

  const handleDeleteItem = () => {
    deleteItem(itemDataRef.current?.id ?? "");
    itemDataRef.current = null;
    closeModal("delete")();
  };

  return (
    <>
      <View
        className="flex-1 bg-background px-4 py-6 pb-24"
        style={{ paddingTop: insets.top }}
      >
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MedicationItem
              data={item}
              onArchivedChange={(archived) =>
                handleArchivedChange(item.id, archived)
              }
              onDelete={() => {
                itemDataRef.current = item;
                openModal("delete")();
              }}
              onEdit={() => {
                itemDataRef.current = item;
                openModal("add")();
              }}
            />
          )}
          contentContainerStyle={{ paddingVertical: 8 }}
        />

        <Button
          variant="primary"
          onPress={() => {
            openModal("add")();
          }}
        >
          <Ionicons name="add" size={24} color="#FFF" />
          <Button.Label>{t("items.add")}</Button.Label>
        </Button>
      </View>
      {modals.add && (
        <CreateItemModal
          open={true}
          data={itemDataRef.current}
          onClose={() => {
            itemDataRef.current = null;
            closeModal("add")();
          }}
        />
      )}
      {modals.delete && (
        <ConfirmDeleteItemModal
          open={true}
          onConfirm={handleDeleteItem}
          onClose={() => {
            itemDataRef.current = null;
            closeModal("delete")();
          }}
        />
      )}
    </>
  );
}
