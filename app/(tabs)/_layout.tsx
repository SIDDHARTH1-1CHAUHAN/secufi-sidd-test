import { Tabs } from 'expo-router';

import { BottomNavBar } from '@/src/components/primitives/BottomNavBar';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <BottomNavBar {...props} />}>
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="household" options={{ title: 'Household' }} />
      <Tabs.Screen name="copilot" options={{ title: 'Copilot' }} />
      <Tabs.Screen name="vault" options={{ title: 'Vault' }} />
    </Tabs>
  );
}
