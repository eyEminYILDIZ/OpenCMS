import { useCurrentPosition } from '@maplibre/maplibre-react-native';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { OperationsSection } from '../components/info/OperationsSection';
import { SettingsSection } from '../components/info/SettingsSection';
import { useLocation } from '../hooks/useLocation';
import { stores } from '../stores';
import { agentTypeLabels, connectionStatusLabels } from '../types';
import { ConnectionStatus } from '../types/enums';
import { DateService } from '../services/DateService';

export const InfoScreen = observer(() => {
  const { t } = useTranslation();
  const { applicationStore, agentStore } = stores;
  const agent = agentStore.selectedItem;

  const { permissionState, requestPermission } = useLocation();
  const currentPosition = useCurrentPosition();

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  const gpsConnectionStatus: ConnectionStatus =
    permissionState === 'denied'
      ? ConnectionStatus.Disconnected
      : currentPosition?.coords
        ? ConnectionStatus.Connected
        : ConnectionStatus.Unknown;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.title}>{t('infoScreen.connectionInfo.title')}</Text>
          <View style={styles.connectionCard}>
            <ConnectionColumn label={t('infoScreen.connectionInfo.api')} status={agentStore.apiConnectionStatus} />
            <ConnectionColumn label={t('infoScreen.connectionInfo.websocket')} status={applicationStore.socketConnectionStatus} />
            <ConnectionColumn label={t('infoScreen.connectionInfo.gps')} status={gpsConnectionStatus} />
          </View>
        </View>

        <OperationsSection />

        <View style={styles.section}>
          <Text style={styles.title}>Agent Info</Text>
          {agent && (
            <>
              <View style={styles.card}>
                <Row label="Name" value={agent.name} />
              </View>
              <View style={styles.card}>
                <Row label="Description" value={agent.description} />
              </View>
              <View style={styles.card}>
                <Row label="Type" value={agentTypeLabels[agent.agentType]} />
              </View>
              <View style={styles.card}>
                <Row label="Active" value={agent.isActive ? 'Yes' : 'No'} />
              </View>
              <View style={styles.card}>
                <Row label="Last Seen" value={DateService.toLocalDate(agent.lastSeen)} />
              </View>
            </>
          )}
        </View>

        <SettingsSection />
      </ScrollView>
    </SafeAreaView>
  );
});

const statusConfig: Record<ConnectionStatus, { color: string; icon: string }> = {
  [ConnectionStatus.Unknown]: { color: '#9CA3AF', icon: 'wifi-alert' },
  [ConnectionStatus.Connected]: { color: '#10B981', icon: 'wifi' },
  [ConnectionStatus.Disconnected]: { color: '#EF4444', icon: 'wifi-off' },
};

const Row = ({ label, value, status }: { label: string; value: string; status?: ConnectionStatus }) => {
  const config = status !== undefined ? statusConfig[status] : undefined;
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.statusValue}>
        <Text style={[styles.value, config && { color: config.color }]}>{value}</Text>
        {config && <MaterialCommunityIcons name={config.icon} size={16} color={config.color} />}
      </View>
    </View>
  );
};

const ConnectionColumn = ({ label, status }: { label: string; status: ConnectionStatus }) => {
  const config = statusConfig[status];
  const isOk = status === ConnectionStatus.Connected;
  return (
    <View style={styles.connectionColumn}>
      <MaterialCommunityIcons name={config.icon} size={20} color={config.color} />
      <Text style={[styles.connectionName, { color: config.color }]}>{label}</Text>
      {!isOk && (
        <Text style={[styles.connectionSubStatus, { color: config.color }]}>
          {connectionStatusLabels[status]}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
    marginLeft: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  value: {
    fontSize: 14,
    color: '#111827',
    flexShrink: 1,
    textAlign: 'right',
  },
  statusValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },
  connectionCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    marginBottom: 4,
  },
  connectionColumn: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  connectionName: {
    fontSize: 13,
    fontWeight: '600',
  },
  connectionSubStatus: {
    fontSize: 11,
  },
});
