import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { useColorScheme } from '@/hooks/use-color-scheme';

const { width, height } = Dimensions.get('window');
const TINT = '#0a7ea4';

const vp = (pct: number) => height * (pct / 100);
const hp = (pct: number) => width * (pct / 100);

/* ─────────────────────────────────────────────
   Data
───────────────────────────────────────────── */

type ListEntry = {
  id: string;
  name: string;
  count: number;
  icon: keyof typeof MaterialIcons.glyphMap;
  spots: string[];
  extra: number;
};

const LISTS: ListEntry[] = [
  {
    id: '1', name: 'Japan 2026', count: 8, icon: 'flight',
    spots: ['Tokyo Shibuya', 'Arashiyama Bamboo', 'Fushimi Inari'], extra: 5,
  },
  {
    id: '2', name: 'Beaches', count: 5, icon: 'beach-access',
    spots: ['Whitehaven Beach', 'Navagio Beach', 'Pink Sand Beach'], extra: 2,
  },
  {
    id: '3', name: 'Hidden Gems', count: 6, icon: 'explore',
    spots: ['Trolltunga', 'Faroe Islands', 'Socotra Island'], extra: 3,
  },
  {
    id: '4', name: 'Food Spots', count: 4, icon: 'restaurant',
    spots: ['Tsukiji Market', 'La Boqueria'], extra: 2,
  },
  {
    id: '5', name: 'Road Trips', count: 3, icon: 'directions-car',
    spots: ['Route 66', 'Great Ocean Road', 'Ring Road Iceland'], extra: 0,
  },
  {
    id: '6', name: 'Weekend Escapes', count: 2, icon: 'weekend',
    spots: ['Porto Old Town', 'Sintra Palaces'], extra: 0,
  },
];

const TOTAL_SPOTS = LISTS.reduce((sum, l) => sum + l.count, 0);

/* ─────────────────────────────────────────────
   Decorative
───────────────────────────────────────────── */

function GridLines({ isDark }: { isDark: boolean }) {
  const color = isDark ? 'rgba(10,126,164,0.07)' : 'rgba(10,126,164,0.09)';
  return (
    <>
      {Array.from({ length: 9 }).map((_, i) => (
        <View key={`h${i}`} pointerEvents="none" style={{
          position: 'absolute', left: 0, right: 0,
          top: (height / 8) * i,
          height: StyleSheet.hairlineWidth, backgroundColor: color,
        }} />
      ))}
      {Array.from({ length: 7 }).map((_, i) => (
        <View key={`v${i}`} pointerEvents="none" style={{
          position: 'absolute', top: 0, bottom: 0,
          left: (width / 6) * i,
          width: StyleSheet.hairlineWidth, backgroundColor: color,
        }} />
      ))}
    </>
  );
}

/* ─────────────────────────────────────────────
   List card
───────────────────────────────────────────── */

function ListCard({ item, index, isDark }: { item: ListEntry; index: number; isDark: boolean }) {
  const anim  = useRef(new Animated.Value(0)).current;
  const animY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(anim,  { toValue: 1, duration: 340, delay: index * 40, useNativeDriver: true }),
      Animated.timing(animY, { toValue: 0, duration: 340, delay: index * 40, useNativeDriver: true }),
    ]).start();
  }, []);

  const cardBg     = isDark ? 'rgba(10,126,164,0.09)' : 'rgba(10,126,164,0.07)';
  const cardBorder = isDark ? 'rgba(10,126,164,0.18)' : 'rgba(10,126,164,0.13)';
  const textColor  = isDark ? '#dce9f2' : '#0c1522';
  const mutedColor = isDark ? '#6a8fa8' : '#4a6a7a';
  const chipBg     = isDark ? 'rgba(10,126,164,0.15)' : 'rgba(10,126,164,0.1)';

  return (
    <Animated.View style={{ opacity: anim, transform: [{ translateY: animY }] }}>
      <TouchableOpacity
        style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}
        activeOpacity={0.75}
      >
        {/* Left accent bar */}
        <View style={styles.accentBar} />

        <View style={styles.cardInner}>
          {/* Top row: name + count badge + icon */}
          <View style={styles.cardTop}>
            <View style={styles.cardTopLeft}>
              <Text style={[styles.listName, { color: textColor, fontSize: hp(4.2) }]} numberOfLines={1}>
                {item.name}
              </Text>
              <View style={[styles.countBadge, { backgroundColor: chipBg, borderColor: cardBorder }]}>
                <Text style={[styles.countBadgeText, { color: TINT, fontSize: hp(2.8) }]}>
                  {item.count} spots
                </Text>
              </View>
            </View>
            <View style={styles.cardTopRight}>
              <MaterialIcons name={item.icon} size={hp(5.5)} color={TINT} style={{ opacity: 0.7 }} />
              <MaterialIcons name="chevron-right" size={hp(4.5)} color={mutedColor} />
            </View>
          </View>

          {/* Spot chips */}
          <View style={styles.chipsRow}>
            {item.spots.map((spot, i) => (
              <View key={i} style={[styles.chip, { backgroundColor: chipBg, borderColor: cardBorder }]}>
                <Text style={[styles.chipText, { color: mutedColor, fontSize: hp(2.8) }]} numberOfLines={1}>
                  {spot}
                </Text>
              </View>
            ))}
            {item.extra > 0 && (
              <Text style={[styles.extraText, { color: TINT, fontSize: hp(2.8) }]}>
                +{item.extra} more
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

/* ─────────────────────────────────────────────
   Screen
───────────────────────────────────────────── */

export default function ListsScreen() {
  const isDark = useColorScheme() === 'dark';

  const headerAnim  = useRef(new Animated.Value(0)).current;
  const headerY     = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerAnim, { toValue: 1, duration: 420, useNativeDriver: true }),
      Animated.timing(headerY,    { toValue: 0, duration: 420, useNativeDriver: true }),
    ]).start();
  }, []);

  const bg          = isDark ? '#0c1522' : '#f4efe6';
  const mutedColor  = isDark ? '#6a8fa8' : '#4a6a7a';
  const pillBg      = isDark ? 'rgba(10,126,164,0.09)' : 'rgba(10,126,164,0.07)';
  const pillBorder  = isDark ? 'rgba(10,126,164,0.28)' : 'rgba(10,126,164,0.2)';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      <GridLines isDark={isDark} />

      <View pointerEvents="none" style={[styles.blobTR, { backgroundColor: TINT, opacity: isDark ? 0.14 : 0.09 }]} />
      <View pointerEvents="none" style={[styles.blobBL, { backgroundColor: isDark ? '#c9963a' : TINT, opacity: isDark ? 0.09 : 0.06 }]} />

      <View style={[styles.inner, { paddingHorizontal: hp(7.2), paddingBottom: vp(12) }]}>

        {/* Header */}
        <Animated.View style={[styles.header, { opacity: headerAnim, transform: [{ translateY: headerY }] }]}>
          <Text style={[styles.title, { color: isDark ? '#dce9f2' : '#0c1522', fontSize: hp(9) }]}>
            My Lists
          </Text>
          <Text style={[styles.subtitle, { color: mutedColor, fontSize: hp(3.6) }]}>
            Your travel collections.
          </Text>

          {/* Stat pills */}
          <View style={styles.statsRow}>
            <View style={[styles.statPill, { backgroundColor: pillBg, borderColor: pillBorder }]}>
              <MaterialIcons name="folder" size={hp(3.5)} color={TINT} />
              <Text style={[styles.statText, { color: TINT, fontSize: hp(3.1) }]}>
                {LISTS.length} lists
              </Text>
            </View>
            <View style={[styles.statPill, { backgroundColor: pillBg, borderColor: pillBorder }]}>
              <MaterialIcons name="place" size={hp(3.5)} color={TINT} />
              <Text style={[styles.statText, { color: TINT, fontSize: hp(3.1) }]}>
                {TOTAL_SPOTS} spots
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* List */}
        <FlatList
          data={LISTS}
          keyExtractor={item => item.id}
          contentContainerStyle={{ gap: vp(1.2), paddingBottom: vp(2) }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <ListCard item={item} index={index} isDark={isDark} />
          )}
        />

      </View>
    </SafeAreaView>
  );
}

/* ─────────────────────────────────────────────
   Styles
───────────────────────────────────────────── */

const styles = StyleSheet.create({
  container: { flex: 1, overflow: 'hidden' },

  blobTR: {
    position: 'absolute',
    width: hp(82), height: hp(82), borderRadius: hp(41),
    top: -hp(23), right: -hp(23),
  },
  blobBL: {
    position: 'absolute',
    width: hp(62), height: hp(62), borderRadius: hp(31),
    bottom: vp(10), left: -hp(18),
  },

  inner: { flex: 1, paddingTop: vp(3) },

  header: { marginBottom: vp(2.4) },
  title:    { fontWeight: '800', letterSpacing: -1.5, marginBottom: vp(0.6) },
  subtitle: { fontStyle: 'italic', fontWeight: '400', letterSpacing: 0.2, marginBottom: vp(1.6) },

  statsRow: { flexDirection: 'row', gap: hp(2.5) },
  statPill: {
    flexDirection: 'row', alignItems: 'center',
    gap: hp(1.8),
    paddingHorizontal: hp(3.5), paddingVertical: vp(0.6),
    borderRadius: 20, borderWidth: 1,
  },
  statText: { fontWeight: '600', letterSpacing: 0.2 },

  card: {
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  accentBar: {
    width: 3,
    backgroundColor: TINT,
  },
  cardInner: {
    flex: 1,
    paddingHorizontal: hp(4),
    paddingVertical: vp(1.6),
    gap: vp(1),
  },

  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTopLeft: { flex: 1, gap: vp(0.5) },
  cardTopRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: hp(1),
    marginLeft: hp(2),
  },

  listName: { fontWeight: '700', letterSpacing: -0.5 },

  countBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: hp(2.5), paddingVertical: vp(0.3),
    borderRadius: 10, borderWidth: 1,
  },
  countBadgeText: { fontWeight: '600' },

  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: hp(1.5),
    alignItems: 'center',
  },
  chip: {
    paddingHorizontal: hp(2.5), paddingVertical: vp(0.35),
    borderRadius: 8, borderWidth: 1,
    maxWidth: hp(35),
  },
  chipText: { fontWeight: '400' },
  extraText: { fontWeight: '600', letterSpacing: 0.1 },
});
