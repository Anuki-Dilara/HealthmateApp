
import { NativeTabs } from 'expo-router/native-tabs';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}
      labelStyle={{ selected: { color: colors.text } }}
    >
      {/* home dashboard tab */}
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/home.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      {/* entering health information tab */}
      <NativeTabs.Trigger name="addrecord">
        <NativeTabs.Trigger.Label>Add Record</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          md="add_circle"
          sf="plus.circle"
        />
      </NativeTabs.Trigger>

      {/* viewing saved records tab */}
      <NativeTabs.Trigger name="records">
        <NativeTabs.Trigger.Label>Records</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          md="calendar_month"
          sf="calendar"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

