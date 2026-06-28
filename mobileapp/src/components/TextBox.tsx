import React from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';
import { colors } from '../theme/colors';

interface TextBoxProps extends TextInputProps {}

export const TextBox: React.FC<TextBoxProps> = (props) => {
  return (
    <TextInput
      placeholderTextColor={colors.mutedForeground}
      clearButtonMode="while-editing"
      {...props}
      style={[styles.input, props.style]}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    margin: 12,
    marginBottom: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    fontSize: 20,
    color: colors.foreground,
    backgroundColor: colors.background,
  },
});
