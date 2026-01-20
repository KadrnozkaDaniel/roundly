import { useUniwind } from "uniwind";

export const useColorMode = () => {
  const { theme } = useUniwind();

  const isDarkMode = theme === "dark";
  const isLightMode = theme === "light";

  return {
    isDarkMode,
    isLightMode,
  };
};
