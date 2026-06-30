import { observer } from 'mobx-react-lite';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SettingsSection } from '../components/info/SettingsSection';
import { stores } from '../stores';
import { agentTypeLabels, connectionStatusLabels } from '../types';
import { ConnectionStatus } from '../types/enums';
import { DateService } from '../services/DateService';

export const InfoScreen = observer(() => {
  const { applicationStore, agentStore } = stores;
  const agent = agentStore.selectedItem;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>Connection Info</Text>
        <View style={styles.card}>
          <Row label="API Status" value={connectionStatusLabels[agentStore.apiConnectionStatus]} status={agentStore.apiConnectionStatus} />
        </View>
        <View style={styles.card}>
          <Row label="Socket Status" value={connectionStatusLabels[applicationStore.socketConnectionStatus]} status={applicationStore.socketConnectionStatus} />
        </View>
      </View>

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
});
