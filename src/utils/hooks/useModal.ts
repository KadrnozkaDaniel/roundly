import { useState } from "react";

export const useModal = () => {
  const [modal, setModal] = useState(false);
  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);

  return [modal, openModal, closeModal] as const;
};

export const useModals = (initialValues: Record<string, boolean>) => {
  const [modals, setModals] = useState(initialValues);

  const openModal = (type: string) => () =>
    setModals((prevState) => ({ ...prevState, [type]: true }));

  const closeModal = (type: string) => () =>
    setModals((prevState) => ({ ...prevState, [type]: false }));

  return [modals, openModal, closeModal] as const;
};
