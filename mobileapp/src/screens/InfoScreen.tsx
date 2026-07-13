import { useCurrentPosition } from '@maplibre/maplibre-react-native';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { OperationsSection } from '../components/info/OperationsSection';
import { SettingsSection } from '../components/info/SettingsSection';
import { stores } from '../stores';
import { agentTypeLabels, connectionStatusLabels } from '../types';
import { ConnectionStatus } from '../types/enums';
import { DateService } from '../services/DateService';
import { useLocation } from '../hooks/useLocation';
import { useCompassHeading } from '../hooks/useCompassHeading';

const METERS_PER_SECOND_TO_KMH = 3.6;

export const InfoScreen = observer(() => {
  const { applicationStore, agentStore } = stores;
  const agent = agentStore.selectedItem;
  const { requestPermission } = useLocation();
  const coords = useCurrentPosition()?.coords;
  const heading = useCompassHeading();

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
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
          <Text style={styles.title}>Device Status</Text>
          <View style={styles.gridCard}>
            <View style={styles.gridRow}>
              <GridItem icon="latitude" value={coords ? coords.latitude.toFixed(5) : '--'} />
              <GridItem icon="longitude" value={coords ? coords.longitude.toFixed(5) : '--'} />
            </View>
            <View style={styles.gridRow}>
              <GridItem icon="speedometer" value={coords?.speed != null ? `${(coords.speed * METERS_PER_SECOND_TO_KMH).toFixed(1)} km/h` : '--'} />
              <GridItem icon="altimeter" value={coords?.altitude != null ? `${coords.altitude.toFixed(0)} m` : '--'} />
            </View>
            <View style={styles.gridRow}>
              <GridItem icon="compass-outline" value={`${heading.toFixed(0)}°`} />
            </View>
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

const GridItem = ({ icon, value }: { icon: string; value: string }) => (
  <View style={styles.gridItem}>
    <MaterialCommunityIcons name={icon} size={20} color="#6B7280" />
    <Text style={styles.gridValue}>{value}</Text>
  </View>
);

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
  gridCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  gridItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  gridValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
});
