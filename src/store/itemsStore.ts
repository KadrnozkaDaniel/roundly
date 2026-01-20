import AsyncStorage from "@react-native-async-storage/async-storage";
import { nanoid } from "nanoid/non-secure";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Item } from "../types/item";

interface ItemsState {
  items: Item[];
  addItem: (item: Omit<Item, "id">) => void;
  updateItem: (id: string, patch: Partial<Item>) => void;
  deleteItem: (id: string) => void;
  archiveItem: (id: string) => void;
}

export const useItemsStore = create<ItemsState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (itemWithoutMeta) => {
        const newItem: Item = {
          id: nanoid(),
          ...itemWithoutMeta,
        };
        set({ items: [...get().items, newItem] });
      },

      updateItem: (id, patch) => {
        set({
          items: get().items.map((it) =>
            it.id === id ? { ...it, ...patch } : it
          ),
        });
      },

      deleteItem: (id) => {
        set({ items: get().items.filter((it) => it.id !== id) });
      },

      archiveItem: (id) => {
        set({
          items: get().items.map((it) =>
            it.id === id ? { ...it, archived: true } : it
          ),
        });
      },
    }),
    {
      name: "items",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
