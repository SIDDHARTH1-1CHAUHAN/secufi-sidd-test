import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/src/lib/providers/AppProviders';

export function EntityAvatar({ label, tone = 'blue' }: { label: string; tone?: 'blue' | 'amber' | 'rose' | 'mint' }) {
  const theme = useAppTheme();
  const backgroundColor = {
    blue: theme.colors.blueSoft,
    amber: theme.colors.amberSoft,
    rose: theme.colors.roseSoft,
    mint: theme.colors.mintSoft,
  }[tone];

  return (
    <View style={[styles.dot, { backgroundColor }]}>
      <Text style={[styles.text, { color: theme.colors.text }]}>{label.slice(0, 1)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  dot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 15,
  },
});
