import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OperationHeader } from '../components/operation/OperationHeader';
import { colors } from '../theme/colors';


export const UpdatesScreen = () => {

  return (
    <SafeAreaView style={styles.container}>
      <OperationHeader />
      <Text style={styles.title}>Updates</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.foreground,
  },

});
