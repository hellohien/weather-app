import { TextInput } from "react-native";

export type BasicInputProps = {
  style?: {};
  value?: string;
  setValue?: (value: string) => void;
  onKeyPress?: () => void;
  placeholder?: string;
};

export function BasicInput({
  style,
  value,
  setValue,
  placeholder,
  onKeyPress,
}: BasicInputProps) {
  return (
    <TextInput
      style={style}
      onChangeText={(text) => setValue && setValue(text)}
      value={value}
      placeholder={placeholder}
      onSubmitEditing={onKeyPress}
    />
  );
}
