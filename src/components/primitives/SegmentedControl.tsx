import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { useAppTheme } from '@/src/lib/providers/AppProviders';

export function SegmentedControl<T extends string>({
  items,
  value,
  onChange,
}: {
  items: readonly T[];
  value: T;
  onChange: (value: T) => void;
}) {
  const theme = useAppTheme();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {items.map((item) => {
        const active = item === value;
        return (
          <Pressable
            key={item}
            onPress={() => onChange(item)}
            style={[styles.item, { borderColor: theme.colors.border }, active && { backgroundColor: theme.colors.blueSoft }]}>
            <Text style={[styles.text, { color: active ? theme.colors.text : theme.colors.textSecondary }]}>{item}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: 10 },
  item: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  text: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 13,
  },
});
