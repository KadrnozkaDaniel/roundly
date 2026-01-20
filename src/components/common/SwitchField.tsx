import { FormField, Switch } from "heroui-native";
import { View } from "react-native";

interface Props {
  isSelected: boolean;
  onSelectedChange: (value: boolean) => void;
  title: string;
  description: string;
}

export const SwitchField = ({
  isSelected,
  onSelectedChange,
  title,
  description,
}: Props) => (
  <FormField
    isSelected={isSelected}
    onSelectedChange={onSelectedChange}
    className="flex justify-between"
  >
    <View>
      <FormField.Label>{title}</FormField.Label>
      <FormField.Description>{description}</FormField.Description>
    </View>
    <FormField.Indicator>
      <Switch />
    </FormField.Indicator>
  </FormField>
);
