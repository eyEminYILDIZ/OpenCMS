import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../theme/colors';
import { AssetsScreen } from '../screens/AssetsScreen';
import { InfoScreen } from '../screens/InfoScreen';
import { MapScreen } from '../screens/MapScreen';
import { OrdersScreen } from '../screens/OrdersScreen';
import { UpdatesScreen } from '../screens/UpdatesScreen';

export type RootTabParamList = {
  Info: undefined;
  Assets: undefined;
  Map: undefined;
  Orders: undefined;
  Updates: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const ACCENT = colors.primary;
const INACTIVE = colors.mutedForeground;
const BAR_BG = colors.card;
const TAB_HEIGHT = 78;
const MAP_SIZE = 60;

type TabBarProps = {
  state: any;
  descriptors: any;
  navigation: any;
};

function CustomTabBar({ state, descriptors, navigation }: TabBarProps) {
  return (
    <View style={styles.barWrapper}>
      <View style={styles.bar}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const isMap = route.name === 'Map';

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          if (isMap) {
            return (
              <View key={route.key} style={styles.mapSlot}>
                <TouchableOpacity
                  style={[styles.mapButton, isFocused && styles.mapButtonActive]}
                  onPress={onPress}
                  activeOpacity={0.85}>
                  <MaterialCommunityIcons
                    name="map-outline"
                    size={30}
                    color={isFocused ? '#FFFFFF' : '#FFFFFF'}
                  />
                  <Text style={styles.mapLabel}>Map</Text>
                </TouchableOpacity>
              </View>
            );
          }

          const iconName = options.tabBarIcon as string;
          const label = options.title ?? route.name;

          return (
            <TouchableOpacity
              key={route.key}
              style={styles.tab}
              onPress={onPress}
              activeOpacity={0.75}>
              <View style={[styles.indicator, isFocused && styles.indicatorActive]} />
              <MaterialCommunityIcons
                name={iconName}
                size={28}
                color={isFocused ? ACCENT : INACTIVE}
              />
              <Text style={[styles.label, isFocused && styles.labelActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Info"
        component={InfoScreen}
        options={{ tabBarIcon: 'information-outline' } as any}
      />
      <Tab.Screen
        name="Assets"
        component={AssetsScreen}
        options={{ tabBarIcon: 'layers-outline' } as any}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{}}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{ tabBarIcon: 'clipboard-list-outline' } as any}
      />
      <Tab.Screen
        name="Updates"
        component={UpdatesScreen}
        options={{ tabBarIcon: 'timeline-outline' } as any}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  barWrapper: {
    backgroundColor: 'transparent',
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  bar: {
    flexDirection: 'row',
    height: TAB_HEIGHT,
    backgroundColor: BAR_BG,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 18,
    gap: 3,
  },
  indicator: {
    position: 'absolute',
    bottom: 6,
    width: 44,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'transparent',
  },
  indicatorActive: {
    backgroundColor: colors.primary,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: INACTIVE,
  },
  labelActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  mapSlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 4,
  },
  mapButton: {
    width: MAP_SIZE,
    height: MAP_SIZE,
    borderRadius: MAP_SIZE / 2,
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 8,
    elevation: 10,
    gap: 1,
  },
  mapButtonActive: {
    backgroundColor: '#27272a',
    transform: [{ scale: 1.05 }],
  },
  mapLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
