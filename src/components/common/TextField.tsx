import { useColorMode } from "@/src/utils/hooks/useColorMode";
import { TextField as HeroTextField } from "heroui-native";
import React, { forwardRef } from "react";
import { StyleProp, TextInput, TextInputProps, ViewStyle } from "react-native";

interface Props extends Omit<TextInputProps, "value" | "onChangeText"> {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  required?: boolean;
  error?: string;
  description?: string;
  containerStyle?: StyleProp<ViewStyle>;
  containerClassName?: string;
  inputStyle?: TextInputProps["style"];
}

export const TextField = forwardRef<TextInput, Props>(
  (
    {
      label,
      value,
      onChangeText,
      required,
      error,
      description,
      containerStyle,
      containerClassName,
      inputStyle,
      ...inputProps
    },
    ref
  ) => {
    const { isDarkMode } = useColorMode();

    return (
      <HeroTextField
        isRequired={required}
        className={containerClassName}
        style={containerStyle}
      >
        <HeroTextField.Label>{label}</HeroTextField.Label>

        <HeroTextField.Input
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          style={{
            borderColor: isDarkMode ? "#2A2A2E" : "#E4E4E7",
            backgroundColor: isDarkMode ? "#0B0B0F" : "#FFFFFF",
            color: isDarkMode ? "#FAFAFA" : "#0A0A0B",
          }}
          {...inputProps}
        />

        {!!error ? (
          <HeroTextField.Description className="text-red-500">
            {error}
          </HeroTextField.Description>
        ) : !!description ? (
          <HeroTextField.Description>{description}</HeroTextField.Description>
        ) : null}
      </HeroTextField>
    );
  }
);

TextField.displayName = "TextField";
