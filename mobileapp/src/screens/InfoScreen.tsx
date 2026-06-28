import { observer } from 'mobx-react-lite';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { stores } from '../stores';
import { agentTypeLabels } from '../types';
import { DateService } from '../services/DateService';

export const InfoScreen = observer(() => {
  const { agentStore } = stores;
  const agent = agentStore.selectedItem;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Info</Text>
      {agent && (
        <View style={styles.card}>
          <Row label="Name" value={agent.name} />
          <Row label="Description" value={agent.description} />
          <Row label="Type" value={agentTypeLabels[agent.agentType]} />
          <Row label="Active" value={agent.isActive ? 'Yes' : 'No'} />
          <Row label="Last Seen" value={DateService.toLocalDate(agent.lastSeen)} />
        </View>
      )}
    </View>
  );
});

const Row = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
});
