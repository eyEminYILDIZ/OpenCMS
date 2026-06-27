import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function UpdatesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Updates</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
  },
});
