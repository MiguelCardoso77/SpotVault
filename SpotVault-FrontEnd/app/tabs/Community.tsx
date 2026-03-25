import React, { useEffect, useRef, useState } from 'react';
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

type Filter = 'week' | 'month' | 'all';

type RankEntry = {
  id: string;
  rank: number;
  spot: string;
  country: string;
  saves: number;
};

const DATA: Record<Filter, RankEntry[]> = {
  week: [
    { id: '1',  rank: 1,  spot: 'Santorini Caldera',   country: 'Greece',    saves: 4821 },
    { id: '2',  rank: 2,  spot: 'Shibuya Crossing',    country: 'Japan',     saves: 4102 },
    { id: '3',  rank: 3,  spot: 'Amalfi Coast',        country: 'Italy',     saves: 3876 },
    { id: '4',  rank: 4,  spot: 'Machu Picchu',        country: 'Peru',      saves: 3541 },
    { id: '5',  rank: 5,  spot: 'Bali Rice Terraces',  country: 'Indonesia', saves: 3210 },
    { id: '6',  rank: 6,  spot: 'Antelope Canyon',     country: 'USA',       saves: 2987 },
    { id: '7',  rank: 7,  spot: 'Trolltunga',          country: 'Norway',    saves: 2654 },
    { id: '8',  rank: 8,  spot: 'Cappadocia Balloons', country: 'Turkey',    saves: 2341 },
    { id: '9',  rank: 9,  spot: 'Plitvice Lakes',      country: 'Croatia',   saves: 2108 },
    { id: '10', rank: 10, spot: 'Faroe Islands',       country: 'Denmark',   saves: 1876 },
  ],
  month: [
    { id: '1',  rank: 1,  spot: 'Amalfi Coast',        country: 'Italy',     saves: 14200 },
    { id: '2',  rank: 2,  spot: 'Santorini Caldera',   country: 'Greece',    saves: 13870 },
    { id: '3',  rank: 3,  spot: 'Machu Picchu',        country: 'Peru',      saves: 12540 },
    { id: '4',  rank: 4,  spot: 'Shibuya Crossing',    country: 'Japan',     saves: 11980 },
    { id: '5',  rank: 5,  spot: 'Cappadocia Balloons', country: 'Turkey',    saves: 10320 },
    { id: '6',  rank: 6,  spot: 'Bali Rice Terraces',  country: 'Indonesia', saves: 9870 },
    { id: '7',  rank: 7,  spot: 'Faroe Islands',       country: 'Denmark',   saves: 8650 },
    { id: '8',  rank: 8,  spot: 'Plitvice Lakes',      country: 'Croatia',   saves: 7940 },
    { id: '9',  rank: 9,  spot: 'Antelope Canyon',     country: 'USA',       saves: 7210 },
    { id: '10', rank: 10, spot: 'Trolltunga',          country: 'Norway',    saves: 6540 },
  ],
  all: [
    { id: '1',  rank: 1,  spot: 'Machu Picchu',        country: 'Peru',      saves: 182400 },
    { id: '2',  rank: 2,  spot: 'Santorini Caldera',   country: 'Greece',    saves: 174100 },
    { id: '3',  rank: 3,  spot: 'Amalfi Coast',        country: 'Italy',     saves: 168700 },
    { id: '4',  rank: 4,  spot: 'Cappadocia Balloons', country: 'Turkey',    saves: 143200 },
    { id: '5',  rank: 5,  spot: 'Bali Rice Terraces',  country: 'Indonesia', saves: 138900 },
    { id: '6',  rank: 6,  spot: 'Shibuya Crossing',    country: 'Japan',     saves: 127600 },
    { id: '7',  rank: 7,  spot: 'Antelope Canyon',     country: 'USA',       saves: 115400 },
    { id: '8',  rank: 8,  spot: 'Faroe Islands',       country: 'Denmark',   saves: 98700 },
    { id: '9',  rank: 9,  spot: 'Plitvice Lakes',      country: 'Croatia',   saves: 87300 },
    { id: '10', rank: 10, spot: 'Trolltunga',          country: 'Norway',    saves: 74100 },
  ],
};

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'week',  label: 'This Week'  },
  { key: 'month', label: 'This Month' },
  { key: 'all',   label: 'All Time'   },
];

function formatSaves(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}m`;
  if (n >= 1000)    return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function rankColor(rank: number): string {
  if (rank === 1) return '#FFD700';
  if (rank === 2) return '#C0C0C0';
  if (rank === 3) return '#CD7F32';
  return TINT;
}

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
   Rank card (animated)
───────────────────────────────────────────── */

function RankCard({ item, index, isDark }: { item: RankEntry; index: number; isDark: boolean }) {
  const anim = useRef(new Animated.Value(0)).current;
  const animY = useRef(new Animated.Value(14)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(anim, {
        toValue: 1, duration: 320,
        delay: index * 40,
        useNativeDriver: true,
      }),
      Animated.timing(animY, {
        toValue: 0, duration: 320,
        delay: index * 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const cardBg = isDark ? 'rgba(10,126,164,0.09)' : 'rgba(10,126,164,0.07)';
  const cardBorder = isDark ? 'rgba(10,126,164,0.18)' : 'rgba(10,126,164,0.13)';
  const textColor = isDark ? '#dce9f2' : '#0c1522';
  const mutedColor = isDark ? '#6a8fa8' : '#4a6a7a';

  return (
    <Animated.View style={{ opacity: anim, transform: [{ translateY: animY }] }}>
      <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>

        {/* Rank */}
        <Text style={[styles.rank, { color: rankColor(item.rank), fontSize: hp(5.5) }]}>
          {item.rank}
        </Text>

        {/* Info */}
        <View style={styles.cardCenter}>
          <Text style={[styles.spotName, { color: textColor, fontSize: hp(3.8) }]} numberOfLines={1}>
            {item.spot}
          </Text>
          <View style={styles.countryRow}>
            <MaterialIcons name="place" size={hp(3.2)} color={mutedColor} />
            <Text style={[styles.countryName, { color: mutedColor, fontSize: hp(3.1) }]}>
              {item.country}
            </Text>
          </View>
        </View>

        {/* Saves */}
        <View style={styles.savesWrap}>
          <MaterialIcons name="bookmark" size={hp(3.8)} color={TINT} />
          <Text style={[styles.savesCount, { color: TINT, fontSize: hp(3.5) }]}>
            {formatSaves(item.saves)}
          </Text>
        </View>

      </View>
    </Animated.View>
  );
}

/* ─────────────────────────────────────────────
   Screen
───────────────────────────────────────────── */

export default function CommunityScreen() {
  const isDark = useColorScheme() === 'dark';
  const [activeFilter, setActiveFilter] = useState<Filter>('week');

  const headerAnim = useRef(new Animated.Value(0)).current;
  const filterAnim = useRef(new Animated.Value(0)).current;
  const filterY    = useRef(new Animated.Value(-10)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(headerAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(filterAnim, { toValue: 1, duration: 340, useNativeDriver: true }),
        Animated.timing(filterY, { toValue: 0, duration: 340, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const bg = isDark ? '#0c1522' : '#f4efe6';
  const mutedColor = isDark ? '#6a8fa8' : '#4a6a7a';
  const pillInactiveBg = isDark ? 'rgba(10,126,164,0.09)' : 'rgba(10,126,164,0.07)';
  const pillInactiveBorder = isDark ? 'rgba(10,126,164,0.18)' : 'rgba(10,126,164,0.13)';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      <GridLines isDark={isDark} />

      <View pointerEvents="none" style={[styles.blobTR, { backgroundColor: TINT, opacity: isDark ? 0.14 : 0.09 }]} />
      <View pointerEvents="none" style={[styles.blobBL, { backgroundColor: isDark ? '#c9963a' : TINT, opacity: isDark ? 0.09 : 0.06 }]} />

      <View style={[styles.inner, { paddingHorizontal: hp(7.2), paddingBottom: vp(12) }]}>

        {/* Header */}
        <Animated.View style={[styles.header, { opacity: headerAnim }]}>
          <Text style={[styles.title, { color: isDark ? '#dce9f2' : '#0c1522', fontSize: hp(9) }]}>
            Community
          </Text>
          <Text style={[styles.subtitle, { color: mutedColor, fontSize: hp(3.6) }]}>
            Where the world wants to go.
          </Text>
        </Animated.View>

        {/* Filter pills */}
        <Animated.View style={[styles.filterRow, { opacity: filterAnim, transform: [{ translateY: filterY }] }]}>
          {FILTERS.map(f => {
            const active = activeFilter === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                style={[
                  styles.pill,
                  active
                    ? { backgroundColor: TINT, borderColor: TINT }
                    : { backgroundColor: pillInactiveBg, borderColor: pillInactiveBorder },
                ]}
                activeOpacity={0.75}
                onPress={() => setActiveFilter(f.key)}
              >
                <Text style={[
                  styles.pillText,
                  { color: active ? '#fff' : mutedColor, fontSize: hp(3.2) },
                ]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </Animated.View>

        {/* Rankings list */}
        <FlatList
          key={activeFilter}
          data={DATA[activeFilter]}
          keyExtractor={item => item.id}
          contentContainerStyle={{ gap: vp(1), paddingTop: vp(0.5), paddingBottom: vp(2) }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <RankCard item={item} index={index} isDark={isDark} />
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

  header: { marginBottom: vp(2.2) },
  title: { fontWeight: '800', letterSpacing: -1.5, marginBottom: vp(0.6) },
  subtitle: { fontStyle: 'italic', fontWeight: '400', letterSpacing: 0.2 },

  filterRow: {
    flexDirection: 'row',
    gap: hp(2.5),
    marginBottom: vp(2),
  },
  pill: {
    paddingHorizontal: hp(4),
    paddingVertical: vp(0.8),
    borderRadius: 20,
    borderWidth: 1,
  },
  pillText: { fontWeight: '600', letterSpacing: 0.2 },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 11,
    borderWidth: 1,
    paddingHorizontal: hp(4),
    paddingVertical: vp(1.6),
    gap: hp(3.5),
  },

  rank: {
    fontWeight: '800',
    width: hp(7),
    textAlign: 'center',
    letterSpacing: -0.5,
  },

  cardCenter: { flex: 1, gap: vp(0.3) },
  spotName: { fontWeight: '700', letterSpacing: -0.3 },
  countryRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  countryName: { fontWeight: '400' },

  savesWrap: { alignItems: 'center', gap: vp(0.2) },
  savesCount: { fontWeight: '700', letterSpacing: -0.3 },
});
