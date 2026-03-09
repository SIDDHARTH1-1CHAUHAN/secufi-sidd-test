import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/src/lib/providers/AppProviders';

const cards = [
  {
    id: 'household-debit',
    bank: 'SecuFi Reserve',
    brand: 'VISA',
    number: '5345 2331 3132 6564',
    owner: 'Ravi & Meera',
    expiry: '08/28',
  },
  {
    id: 'family-card',
    bank: 'SecuFi Family',
    brand: 'Debit',
    number: '4221 7712 1044 8810',
    owner: 'Household Access',
    expiry: '02/29',
  },
] as const;

export function DebitCardShowcase({ onActionPress }: { onActionPress?: (action: string) => void }) {
  const theme = useAppTheme();

  return (
    <View style={styles.wrap}>
      <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsRow}>
        {cards.map((card, index) => (
          <View key={card.id} style={[styles.card, { backgroundColor: index === 0 ? '#131B15' : '#101410', borderColor: theme.colors.borderStrong }]}> 
            <View style={[styles.glowLarge, { backgroundColor: theme.colors.blueSoft }]} />
            <View style={[styles.glowSmall, { backgroundColor: theme.colors.ivorySoft }]} />
            <View style={styles.cardTop}>
              <Text style={[styles.bank, { color: theme.colors.textMuted }]}>{card.bank}</Text>
              <Text style={[styles.brand, { color: theme.colors.text }]}>{card.brand}</Text>
            </View>
            <View style={[styles.chip, { backgroundColor: theme.colors.amber }]} />
            <Text style={[styles.number, { color: theme.colors.text }]}>{card.number}</Text>
            <View style={styles.cardFooter}>
              <View>
                <Text style={[styles.footerLabel, { color: theme.colors.textMuted }]}>Cardholder</Text>
                <Text style={[styles.footerValue, { color: theme.colors.text }]}>{card.owner}</Text>
              </View>
              <View>
                <Text style={[styles.footerLabel, { color: theme.colors.textMuted }]}>Valid thru</Text>
                <Text style={[styles.footerValue, { color: theme.colors.text }]}>{card.expiry}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.actionsRow}>
        {['Share', 'Protect', 'Review'].map((action) => (
          <Pressable key={action} onPress={() => onActionPress?.(action)} style={[styles.actionPill, { borderColor: theme.colors.border }]}> 
            <Ionicons name={action === 'Share' ? 'share-outline' : action === 'Protect' ? 'shield-checkmark-outline' : 'eye-outline'} size={14} color={theme.colors.text} />
            <Text style={[styles.actionText, { color: theme.colors.text }]}>{action}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 12 },
  cardsRow: { gap: 14 },
  card: {
    width: 300,
    height: 188,
    borderRadius: 28,
    borderWidth: 1,
    padding: 18,
    overflow: 'hidden',
    gap: 14,
  },
  glowLarge: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    right: -40,
    top: -60,
  },
  glowSmall: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    left: -10,
    bottom: -20,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bank: { fontFamily: 'Manrope_600SemiBold', fontSize: 13 },
  brand: { fontFamily: 'Manrope_800ExtraBold', fontSize: 28 },
  chip: { width: 30, height: 22, borderRadius: 6 },
  number: { fontFamily: 'Manrope_600SemiBold', fontSize: 24, letterSpacing: 1.6, marginTop: 12 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 'auto' },
  footerLabel: { fontFamily: 'Manrope_600SemiBold', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 },
  footerValue: { fontFamily: 'Manrope_700Bold', fontSize: 13 },
  actionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  actionPill: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionText: { fontFamily: 'Manrope_600SemiBold', fontSize: 12 },
});
