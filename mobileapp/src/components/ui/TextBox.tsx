import React from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';
import { colors } from '../../theme/colors';
import { useFormContextOptional } from './Form';

type BlurEvent = Parameters<NonNullable<TextInputProps['onBlur']>>[0];

interface TextBoxProps<T extends Record<string, unknown> = Record<string, unknown>> extends TextInputProps {
  name?: keyof T & string;
}

export function TextBox<T extends Record<string, unknown> = Record<string, unknown>>({
  name,
  value,
  onChangeText,
  onBlur,
  ...props
}: TextBoxProps<T>) {
  const ctx = useFormContextOptional();

  const resolvedValue = value ?? (ctx && name ? (ctx.values[name] as string | undefined) : undefined);
  const resolvedOnChangeText = onChangeText ?? (ctx && name
    ? (text: string) => ctx.setFieldValue(name, text)
    : undefined);
  const resolvedOnBlur = onBlur ?? (ctx && name
    ? (_e: BlurEvent) => ctx.setFieldTouched(name, true)
    : undefined);

  return (
    <TextInput
      placeholderTextColor={colors.mutedForeground}
      clearButtonMode="while-editing"
      {...props}
      value={resolvedValue}
      onChangeText={resolvedOnChangeText}
      onBlur={resolvedOnBlur}
      style={[styles.input, props.style]}
    />
  );
}

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
