import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/src/lib/providers/AppProviders';

const iconByRoute: Record<string, keyof typeof Ionicons.glyphMap> = {
  home: 'home-outline',
  household: 'git-network-outline',
  copilot: 'sparkles-outline',
  vault: 'folder-open-outline',
};

export function BottomNavBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const theme = useAppTheme();

  return (
    <View style={styles.frame}>
      <BlurView intensity={36} tint="dark" style={[styles.container, { borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceGlass }]}> 
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const label = descriptors[route.key].options.title ?? route.name;
          return (
            <Pressable key={route.key} onPress={() => navigation.navigate(route.name as never)} style={styles.item}>
              <View style={[styles.iconWrap, isFocused && { backgroundColor: theme.colors.ivorySoft }]}> 
                <Ionicons name={iconByRoute[route.name] ?? 'ellipse-outline'} size={18} color={isFocused ? theme.colors.text : theme.colors.textMuted} />
              </View>
              <Text style={[styles.label, { color: isFocused ? theme.colors.text : theme.colors.textMuted }]}>{label}</Text>
              {isFocused ? <View style={[styles.indicator, { backgroundColor: theme.colors.blue }]} /> : <View style={styles.indicatorSpacer} />}
            </Pressable>
          );
        })}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { position: 'absolute', left: 18, right: 18, bottom: 24 },
  container: { flexDirection: 'row', borderWidth: 1, borderRadius: 30, overflow: 'hidden', paddingHorizontal: 10, paddingVertical: 9, gap: 6 },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 4 },
  iconWrap: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  label: { fontFamily: 'Manrope_600SemiBold', fontSize: 11 },
  indicator: { width: 16, height: 3, borderRadius: 99 },
  indicatorSpacer: { width: 16, height: 3 },
});
