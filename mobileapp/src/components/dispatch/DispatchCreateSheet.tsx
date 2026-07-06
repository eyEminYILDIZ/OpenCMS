import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DispatchApi } from '../../api';
import { colors } from '../../theme/colors';
import { stores } from '../../stores';
import { PanelModes } from '../../types';
import { GuidService } from '../../services';
import { Form, FormItem, FormMode, TextBox, DateTimePicker } from '../ui';
import { agentId } from '../../../app.json';

type FormValues = Omit<DispatchApi.Create.Request, never>;

export const DispatchCreateSheet = observer(() => {
  const { dispatchStore, operationStore } = stores;
  const { t } = useTranslation();

  const visible = dispatchStore.panelMode === PanelModes.Create;

  const buildInitialValues = (): FormValues => ({
    title: '',
    description: '',
    category: DispatchApi.Enums.DispatchCategories.Operation,
    occuredAt: '',
    relatedEntityId: operationStore.selectedItem?.id ?? GuidService.generateEmptyGuid(),
    relatedChildEntityId: null,
    providerAgentId: agentId,
  });

  const validationSchema: Yup.ObjectSchema<FormValues> = Yup.object({
    title: Yup.string().required(t('common.validation.required')),
    description: Yup.string().required(t('common.validation.required')),
    category: Yup.number().required(t('common.validation.required')),
    occuredAt: Yup.string().required(t('common.validation.required')),
    relatedEntityId: Yup.string().required(t('common.validation.required')),
    relatedChildEntityId: Yup.string().nullable().default(null),
    providerAgentId: Yup.string().required(t('common.validation.required')),
  });

  const formik = useFormik<FormValues>({
    initialValues: buildInitialValues(),
    validationSchema,
    onSubmit: async (values) => {
      await dispatchStore.createItem(values);
    },
  });

  useEffect(() => {
    if (visible) {
      formik.resetForm({ values: buildInitialValues() });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const handleClose = () => dispatchStore.setPanelMode(PanelModes.Detail);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={handleClose} />
        <KeyboardAvoidingView
          style={styles.sheet}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.header}>
            <Text style={styles.title}>{t('dispatch.create.title')}</Text>
            <TouchableOpacity onPress={handleClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <MaterialCommunityIcons name="close" size={24} color={colors.mutedForeground} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Form formik={formik} mode={FormMode.Create}>
              <FormItem<FormValues> name="title" label={t('dispatch.fields.title')}>
                <TextBox<FormValues> name="title" placeholder={t('dispatch.fields.title')} />
              </FormItem>

              <FormItem<FormValues> name="description" label={t('dispatch.fields.description')}>
                <TextBox<FormValues>
                  name="description"
                  placeholder={t('dispatch.fields.description')}
                  multiline
                  numberOfLines={4}
                  style={styles.textArea}
                />
              </FormItem>

              <FormItem<FormValues> name="occuredAt" label={t('dispatch.fields.occuredAt')}>
                <DateTimePicker<FormValues> name="occuredAt" mode="datetime" />
              </FormItem>
            </Form>

            <TouchableOpacity
              style={[styles.saveButton, formik.isSubmitting && styles.saveButtonDisabled]}
              onPress={() => formik.handleSubmit()}
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? (
                <ActivityIndicator size="small" color={colors.primaryForeground} />
              ) : (
                <MaterialCommunityIcons name="content-save-outline" size={18} color={colors.primaryForeground} />
              )}
              <Text style={styles.saveButtonText}>
                {formik.isSubmitting ? t('common.saving') : t('common.save')}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '90%',
    overflow: 'hidden',
    padding: 20,
  },
  scroll: {
    flexShrink: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.cardForeground,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    marginTop: 12,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: colors.primaryForeground,
    fontSize: 15,
    fontWeight: '600',
  },
});
