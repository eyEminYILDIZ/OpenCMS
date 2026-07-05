import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useFormContext } from './Form';
import { colors } from '../../theme/colors';

interface FormItemProps<T extends Record<string, unknown> = Record<string, unknown>> {
  name?: keyof T & string;
  label?: string;
  children: React.ReactNode;
}

export function FormItem<T extends Record<string, unknown> = Record<string, unknown>>({
  name,
  label,
  children,
}: FormItemProps<T>) {
  const { touched, errors } = useFormContext();
  const error = name && touched[name] && errors[name]
    ? String(errors[name])
    : undefined;

  return (
    <View style={styles.field}>
      {label && <Text style={styles.label}>{label}</Text>}
      {children}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.mutedForeground,
    marginHorizontal: 12,
    marginTop: 8,
  },
  error: {
    fontSize: 12,
    color: colors.destructive,
    marginHorizontal: 12,
    marginTop: 4,
  },
});
