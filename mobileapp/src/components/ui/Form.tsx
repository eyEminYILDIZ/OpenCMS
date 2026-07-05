import React, { createContext, useContext } from 'react';
import { View } from 'react-native';
import { FormikProps } from 'formik';

export enum FormMode {
  Create = 'create',
  Update = 'update',
}

interface FormContextValue {
  touched: Record<string, unknown>;
  errors: Record<string, unknown>;
  values: Record<string, unknown>;
  setFieldValue: (field: string, value: unknown) => void;
  setFieldTouched: (field: string, touched?: boolean) => void;
}

const FormContext = createContext<FormContextValue | null>(null);

export function useFormContext(): FormContextValue {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error('useFormContext must be used inside <Form>');
  return ctx;
}

export function useFormContextOptional(): FormContextValue | null {
  return useContext(FormContext);
}

interface FormProps<T> {
  formik: FormikProps<T>;
  mode: FormMode;
  children: React.ReactNode;
}

export function Form<T>({ formik, children }: FormProps<T>) {
  const value: FormContextValue = {
    touched: formik.touched as Record<string, unknown>,
    errors: formik.errors as Record<string, unknown>,
    values: formik.values as Record<string, unknown>,
    setFieldValue: formik.setFieldValue,
    setFieldTouched: formik.setFieldTouched,
  };

  return (
    <FormContext.Provider value={value}>
      <View>{children}</View>
    </FormContext.Provider>
  );
}
