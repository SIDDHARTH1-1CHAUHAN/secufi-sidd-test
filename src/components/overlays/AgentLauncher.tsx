import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { router, useSegments } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';

import { useAppTheme, useCopilot } from '@/src/lib/providers/AppProviders';

export function AgentLauncher() {
  const theme = useAppTheme();
  const { setPromptDraft } = useCopilot();
  const segments = useSegments();
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(withSequence(withTiming(1.06, { duration: 900 }), withTiming(1, { duration: 900 })), -1, false);
  }, [pulse]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const segmentText = segments.join('/');
  const inTabs = segments[0] === '(tabs)';
  const onCopilot = segmentText.includes('copilot');

  if (!inTabs || onCopilot) {
    return null;
  }

  return (
    <Animated.View style={[styles.frame, animatedStyle]}>
      <Pressable
        onPress={() => {
          setPromptDraft('What should I do next for this household?');
          router.push('/(tabs)/copilot');
        }}>
        <BlurView intensity={45} tint="dark" style={[styles.shell, { borderColor: theme.colors.borderStrong, backgroundColor: theme.colors.surfaceGlass }]}> 
          <View style={[styles.icon, { backgroundColor: theme.colors.blueSoft }]}> 
            <Ionicons name="sparkles-outline" size={18} color={theme.colors.text} />
          </View>
          <Text style={[styles.label, { color: theme.colors.text }]}>Ask SecuFi</Text>
        </BlurView>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  frame: {
    position: 'absolute',
    right: 18,
    bottom: 110,
  },
  shell: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 12,
    paddingRight: 4,
  },
});
