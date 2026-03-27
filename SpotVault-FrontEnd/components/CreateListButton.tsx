import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  Animated,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { createList } from '@/services/SpotListService';
import { SpotList, VisibilityStatus } from '@/models/SpotList';

const VISIBILITY_OPTIONS: { value: VisibilityStatus; label: string; icon: keyof typeof MaterialIcons.glyphMap }[] = [
  { value: 'PRIVATE',  label: 'Private',  icon: 'lock' },
  { value: 'FRIENDS',  label: 'Friends',  icon: 'group' },
  { value: 'PUBLIC',   label: 'Public',   icon: 'public' },
];

const { width, height } = Dimensions.get('window');
const TINT = '#0a7ea4';
const hp = (pct: number) => width * (pct / 100);
const vp = (pct: number) => height * (pct / 100);

/* ─────────────────────────────────────────────
   Config
───────────────────────────────────────────── */

const ICON_OPTIONS: Array<keyof typeof MaterialIcons.glyphMap> = [
  'flight', 'beach-access', 'explore', 'restaurant', 'directions-car',
  'weekend', 'hiking', 'camera-alt', 'favorite', 'star',
  'local-cafe', 'terrain', 'water', 'forest', 'museum',
  'nightlife', 'shopping-bag', 'sports', 'spa', 'festival',
];

const COLOR_OPTIONS = [
  '#0a7ea4', '#2ecc71', '#e67e22', '#e74c3c', '#9b59b6',
  '#1abc9c', '#f39c12', '#e91e63', '#3f51b5', '#ff5722',
];

/* ─────────────────────────────────────────────
   Props
───────────────────────────────────────────── */

interface CreateListButtonProps {
  ownerId?: string;
  onCreated?: (list: SpotList) => void;
}

/* ─────────────────────────────────────────────
   Component
───────────────────────────────────────────── */

export default function CreateListButton({ ownerId = '', onCreated }: CreateListButtonProps) {
  const isDark = useColorScheme() === 'dark';

  const [open, setOpen]               = useState(false);
  const [name, setName]               = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<keyof typeof MaterialIcons.glyphMap>('explore');
  const [selectedColor, setSelectedColor] = useState(TINT);
  const [visibility, setVisibility]   = useState<VisibilityStatus>('PRIVATE');
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');

  // Slide-in from right animation
  const slideAnim = useRef(new Animated.Value(width)).current;
  // Button press scale
  const btnScale = useRef(new Animated.Value(1)).current;

  const openSheet = () => {
    setOpen(true);
    setError('');
    slideAnim.setValue(width);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 380,
      useNativeDriver: true,
    }).start();
  };

  const closeSheet = () => {
    Animated.timing(slideAnim, {
      toValue: width,
      duration: 280,
      useNativeDriver: true,
    }).start(() => {
      setOpen(false);
      setName('');
      setDescription('');
      setSelectedIcon('explore');
      setSelectedColor(TINT);
      setVisibility('PRIVATE');
      setError('');
    });
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      setError('A name is required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const now = new Date().toISOString();
      const payload: SpotList = {
        listId: '',
        ownerId,
        name: name.trim(),
        description: description.trim(),
        icon: selectedIcon as string,
        color: selectedColor,
        visibilityStatus: visibility,
        spotIds: [],
        createdAt: now,
        updatedAt: now,
      };
      console.log('[CreateList] Sending payload:', JSON.stringify(payload, null, 2));
      const created = await createList(payload);
      console.log('[CreateList] Success:', JSON.stringify(created, null, 2));
      onCreated?.(created);
      closeSheet();
    } catch (e: any) {
      console.error('[CreateList] Error:', e?.message);
      console.error('[CreateList] Response status:', e?.response?.status);
      console.error('[CreateList] Response data:', JSON.stringify(e?.response?.data, null, 2));
      setError('Failed to create list. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onPressIn  = () => Animated.spring(btnScale, { toValue: 0.94, useNativeDriver: true, speed: 40 }).start();
  const onPressOut = () => Animated.spring(btnScale, { toValue: 1,    useNativeDriver: true, speed: 40 }).start();

  /* ── derived colors ── */
  const pageBg     = isDark ? '#0c1522' : '#f4efe6';
  const textColor  = isDark ? '#dce9f2' : '#0c1522';
  const mutedColor = isDark ? '#6a8fa8' : '#4a6a7a';
  const inputBg    = isDark ? 'rgba(10,126,164,0.08)' : 'rgba(10,126,164,0.05)';
  const inputBorder= isDark ? 'rgba(10,126,164,0.22)' : 'rgba(10,126,164,0.18)';
  const divider    = isDark ? 'rgba(10,126,164,0.14)' : 'rgba(10,126,164,0.1)';

  return (
    <>
      {/* ── Trigger button ── */}
      <Animated.View style={{ transform: [{ scale: btnScale }] }}>
        <TouchableOpacity
          onPress={openSheet}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          activeOpacity={1}
          style={[styles.triggerBtn, { borderColor: inputBorder }]}
        >
          <View style={[styles.triggerInner, { backgroundColor: isDark ? 'rgba(10,126,164,0.13)' : 'rgba(10,126,164,0.08)' }]}>
            <MaterialIcons name="add" size={hp(4.8)} color={TINT} />
            <Text style={[styles.triggerLabel, { color: TINT, fontSize: hp(3.4) }]}>
              New List
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* ── Full-screen page modal ── */}
      <Modal
        visible={open}
        transparent={false}
        animationType="none"
        statusBarTranslucent
        onRequestClose={closeSheet}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={[styles.modalWrapper, { backgroundColor: pageBg }]}
        >
          {/* Page */}
          <Animated.View
            style={[
              styles.sheet,
              { backgroundColor: pageBg, transform: [{ translateX: slideAnim }] },
            ]}
          >
            <SafeAreaView style={{ flex: 1 }}>
              {/* Nav bar */}
              <View style={[styles.sheetHeader, { borderBottomColor: divider }]}>
                <TouchableOpacity onPress={closeSheet} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }} style={styles.backBtn}>
                  <MaterialIcons name="arrow-back-ios" size={hp(4.5)} color={TINT} />
                  <Text style={[styles.backLabel, { color: TINT, fontSize: hp(3.6) }]}>Lists</Text>
                </TouchableOpacity>
                <Text style={[styles.sheetTitle, { color: name.trim() ? textColor : mutedColor, fontSize: hp(4.6) }]}>
                  {name.trim() || 'New List'}
                </Text>
                <View style={{ width: hp(14) }} />
              </View>

              <ScrollView
                style={styles.formScroll}
                contentContainerStyle={styles.formContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {/* Name */}
                <View style={styles.fieldGroup}>
                  <Text style={[styles.fieldLabel, { color: mutedColor, fontSize: hp(2.9) }]}>
                    NAME <Text style={{ color: TINT }}>*</Text>
                  </Text>
                  <TextInput
                    value={name}
                    onChangeText={t => { setName(t); setError(''); }}
                    placeholder="e.g. Japan 2026"
                    placeholderTextColor={mutedColor}
                    style={[styles.input, {
                      backgroundColor: inputBg,
                      borderColor: error && !name.trim() ? '#ef4444' : inputBorder,
                      color: textColor,
                      fontSize: hp(3.6),
                    }]}
                    maxLength={40}
                    returnKeyType="next"
                  />
                </View>

                {/* Description */}
                <View style={styles.fieldGroup}>
                  <Text style={[styles.fieldLabel, { color: mutedColor, fontSize: hp(2.9) }]}>
                    DESCRIPTION
                  </Text>
                  <TextInput
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Optional note about this list…"
                    placeholderTextColor={mutedColor}
                    style={[styles.input, styles.inputMultiline, {
                      backgroundColor: inputBg,
                      borderColor: inputBorder,
                      color: textColor,
                      fontSize: hp(3.4),
                    }]}
                    multiline
                    numberOfLines={3}
                    maxLength={120}
                    returnKeyType="done"
                  />
                </View>

                {/* Icon picker */}
                <View style={styles.fieldGroup}>
                  <Text style={[styles.fieldLabel, { color: mutedColor, fontSize: hp(2.9) }]}>
                    ICON
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.iconScroll}>
                    <View style={styles.iconRow}>
                      {ICON_OPTIONS.map(icon => {
                        const active = selectedIcon === icon;
                        return (
                          <TouchableOpacity
                            key={icon}
                            onPress={() => setSelectedIcon(icon)}
                            style={[
                              styles.iconOption,
                              {
                                backgroundColor: active
                                  ? selectedColor + '28'
                                  : inputBg,
                                borderColor: active ? selectedColor : inputBorder,
                              },
                            ]}
                          >
                            <MaterialIcons
                              name={icon}
                              size={hp(5)}
                              color={active ? selectedColor : mutedColor}
                            />
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </ScrollView>
                </View>

                {/* Color picker */}
                <View style={styles.fieldGroup}>
                  <Text style={[styles.fieldLabel, { color: mutedColor, fontSize: hp(2.9) }]}>
                    COLOR
                  </Text>
                  <View style={styles.colorRow}>
                    {COLOR_OPTIONS.map(color => {
                      const active = selectedColor === color;
                      return (
                        <TouchableOpacity
                          key={color}
                          onPress={() => setSelectedColor(color)}
                          style={[
                            styles.colorSwatch,
                            { backgroundColor: color },
                            active && styles.colorSwatchActive,
                          ]}
                        >
                          {active && (
                            <MaterialIcons name="check" size={hp(3.6)} color="#fff" />
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Visibility */}
                <View style={styles.fieldGroup}>
                  <Text style={[styles.fieldLabel, { color: mutedColor, fontSize: hp(2.9) }]}>
                    VISIBILITY
                  </Text>
                  <View style={styles.visibilityRow}>
                    {VISIBILITY_OPTIONS.map(opt => {
                      const active = visibility === opt.value;
                      return (
                        <TouchableOpacity
                          key={opt.value}
                          onPress={() => setVisibility(opt.value)}
                          style={[
                            styles.visibilityOption,
                            {
                              backgroundColor: active ? selectedColor + '22' : inputBg,
                              borderColor: active ? selectedColor : inputBorder,
                              flex: 1,
                            },
                          ]}
                        >
                          <MaterialIcons
                            name={opt.icon}
                            size={hp(4.2)}
                            color={active ? selectedColor : mutedColor}
                          />
                          <Text style={[
                            styles.visibilityLabel,
                            { color: active ? selectedColor : mutedColor, fontSize: hp(3) },
                          ]}>
                            {opt.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Error */}
                {!!error && (
                  <View style={styles.errorRow}>
                    <MaterialIcons name="error-outline" size={hp(3.6)} color="#ef4444" />
                    <Text style={[styles.errorText, { fontSize: hp(3.1) }]}>{error}</Text>
                  </View>
                )}

              </ScrollView>

              {/* Actions — pinned to bottom */}
              <View style={[styles.actionsRow, { borderTopColor: divider }]}>
                  <TouchableOpacity
                    onPress={closeSheet}
                    style={[styles.btnCancel, { borderColor: inputBorder }]}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.btnCancelText, { color: mutedColor, fontSize: hp(3.6) }]}>
                      Cancel
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleCreate}
                    disabled={loading}
                    style={[styles.btnCreate, { backgroundColor: selectedColor, opacity: loading ? 0.7 : 1 }]}
                    activeOpacity={0.8}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <>
                        <MaterialIcons name="add" size={hp(4.2)} color="#fff" />
                        <Text style={[styles.btnCreateText, { fontSize: hp(3.6) }]}>
                          Create
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
            </SafeAreaView>
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

/* ─────────────────────────────────────────────
   Styles
───────────────────────────────────────────── */

const styles = StyleSheet.create({
  /* Trigger */
  triggerBtn: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  triggerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: hp(2),
    paddingHorizontal: hp(4.5),
    paddingVertical: vp(1.4),
  },
  triggerLabel: {
    fontWeight: '700',
    letterSpacing: -0.3,
  },

  /* Modal wrapper — fills the screen */
  modalWrapper: {
    flex: 1,
  },

  /* Sheet — full screen page */
  sheet: {
    flex: 1,
  },
  handle: {
    display: 'none',
    width: 0,
    height: 0,
  },

  /* Sheet header */
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: hp(4),
    paddingVertical: vp(1.6),
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  sheetTitle: {
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    width: hp(14),
  },
  backLabel: {
    fontWeight: '500',
    marginLeft: -hp(1),
  },

  /* Form */
  formScroll: { flex: 1, flexGrow: 1 },
  formContent: {
    paddingHorizontal: hp(6),
    paddingTop: vp(2),
    paddingBottom: vp(2),
    gap: vp(2.2),
  },

  fieldGroup: { gap: vp(0.8) },
  fieldLabel: {
    fontWeight: '600',
    letterSpacing: 0.8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 11,
    paddingHorizontal: hp(3.8),
    paddingVertical: vp(1.4),
    fontWeight: '500',
  },
  inputMultiline: {
    height: vp(10),
    textAlignVertical: 'top',
    paddingTop: vp(1.4),
  },

  /* Icon picker */
  iconScroll: { marginHorizontal: -hp(1) },
  iconRow: {
    flexDirection: 'row',
    gap: hp(2.2),
    paddingHorizontal: hp(1),
    paddingVertical: vp(0.4),
  },
  iconOption: {
    width: hp(12),
    height: hp(12),
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Color picker */
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: hp(2.8),
    paddingVertical: vp(0.4),
  },
  colorSwatch: {
    width: hp(9.5),
    height: hp(9.5),
    borderRadius: hp(4.75),
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorSwatchActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 6,
    transform: [{ scale: 1.12 }],
  },

  /* Visibility */
  visibilityRow: {
    flexDirection: 'row',
    gap: hp(2.5),
  },
  visibilityOption: {
    borderWidth: 1.5,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: vp(1.4),
    gap: vp(0.5),
  },
  visibilityLabel: {
    fontWeight: '600',
    letterSpacing: 0.1,
  },

  /* Error */
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: hp(1.8),
  },
  errorText: {
    color: '#ef4444',
    fontWeight: '500',
  },

  /* Actions */
  actionsRow: {
    flexDirection: 'row',
    gap: hp(3),
    paddingHorizontal: hp(6),
    paddingVertical: vp(2),
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  btnCancel: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: vp(1.6),
  },
  btnCancelText: {
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  btnCreate: {
    flex: 2,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: hp(1.5),
    paddingVertical: vp(1.6),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 6,
    elevation: 5,
  },
  btnCreateText: {
    color: '#fff',
    fontWeight: '700',
    letterSpacing: -0.3,
  },
});
