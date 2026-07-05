import React, { useState } from 'react';
import { Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RNDateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useTranslation } from 'react-i18next';
import { colors } from '../../theme/colors';
import { useFormContext } from './Form';

export type DateTimePickerMode = 'date' | 'datetime';

interface DateTimePickerProps<T extends Record<string, unknown> = Record<string, unknown>> {
  name: keyof T & string;
  mode?: DateTimePickerMode;
  placeholder?: string;
  minimumDate?: Date;
  maximumDate?: Date;
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function formatDisplay(date: Date, mode: DateTimePickerMode): string {
  const datePart = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  if (mode === 'date') return datePart;
  return `${datePart} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function DateTimePicker<T extends Record<string, unknown> = Record<string, unknown>>({
  name,
  mode = 'date',
  placeholder,
  minimumDate,
  maximumDate,
}: DateTimePickerProps<T>) {
  const { values, setFieldValue } = useFormContext();
  const value = values[name] as string | undefined;
  const onChange = (iso: string) => setFieldValue(name, iso);
  const { t } = useTranslation();
  const [iosOpen, setIosOpen] = useState(false);
  const [androidStage, setAndroidStage] = useState<'none' | 'date' | 'time'>(
    'none',
  );
  const [draftDate, setDraftDate] = useState<Date | null>(null);

  const selectedDate = value ? new Date(value) : undefined;

  const openPicker = () => {
    setDraftDate(selectedDate ?? new Date());
    if (Platform.OS === 'ios') {
      setIosOpen(true);
    } else {
      setAndroidStage('date');
    }
  };

  const handleIosChange = (_event: DateTimePickerEvent, date?: Date) => {
    if (date) setDraftDate(date);
  };

  const confirmIos = () => {
    if (draftDate) onChange(draftDate.toISOString());
    setIosOpen(false);
  };

  const cancelIos = () => setIosOpen(false);

  const handleAndroidDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (event.type === 'dismissed' || !date) {
      setAndroidStage('none');
      return;
    }
    if (mode === 'datetime') {
      setDraftDate(date);
      setAndroidStage('time');
    } else {
      onChange(date.toISOString());
      setAndroidStage('none');
    }
  };

  const handleAndroidTimeChange = (event: DateTimePickerEvent, time?: Date) => {
    setAndroidStage('none');
    if (event.type === 'dismissed' || !time || !draftDate) return;
    const combined = new Date(draftDate);
    combined.setHours(time.getHours(), time.getMinutes());
    onChange(combined.toISOString());
  };

  return (
    <>
      <TouchableOpacity
        style={styles.field}
        onPress={openPicker}
        activeOpacity={0.7}
      >
        <Text style={[styles.text, !selectedDate && styles.placeholder]}>
          {selectedDate
            ? formatDisplay(selectedDate, mode)
            : (placeholder ?? t('common.datePicker.placeholder'))}
        </Text>
      </TouchableOpacity>

      {Platform.OS === 'ios' && iosOpen && (
        <Modal
          transparent
          animationType="fade"
          visible
          onRequestClose={cancelIos}
        >
          <TouchableOpacity
            style={styles.overlay}
            activeOpacity={1}
            onPress={cancelIos}
          >
            <View style={styles.iosPicker}>
              <RNDateTimePicker
                value={draftDate ?? new Date()}
                mode={mode}
                display="spinner"
                onChange={handleIosChange}
                minimumDate={minimumDate}
                maximumDate={maximumDate}
              />
              <View style={styles.iosButtonRow}>
                <TouchableOpacity onPress={cancelIos} style={styles.iosButton}>
                  <Text style={styles.iosButtonText}>{t('common.cancel')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={confirmIos} style={styles.iosButton}>
                  <Text style={[styles.iosButtonText, styles.iosConfirmText]}>
                    {t('common.save')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      {Platform.OS === 'android' && androidStage === 'date' && (
        <RNDateTimePicker
          value={draftDate ?? new Date()}
          mode="date"
          display="default"
          onChange={handleAndroidDateChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      )}

      {Platform.OS === 'android' && androidStage === 'time' && (
        <RNDateTimePicker
          value={draftDate ?? new Date()}
          mode="time"
          display="default"
          onChange={handleAndroidTimeChange}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  field: {
    margin: 12,
    marginBottom: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    backgroundColor: colors.background,
  },
  text: {
    fontSize: 20,
    color: colors.foreground,
  },
  placeholder: {
    color: colors.mutedForeground,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  iosPicker: {
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  iosButtonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  iosButton: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  iosButtonText: {
    fontSize: 16,
    color: colors.mutedForeground,
  },
  iosConfirmText: {
    color: colors.primary,
    fontWeight: '600',
  },
});
