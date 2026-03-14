import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

type Props = {
  visible: boolean;
  images: string[];
  initialIndex?: number;
  onClose: () => void;
};

export default function ImageViewerModal({ visible, images, initialIndex = 0, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView | null>(null);
  const safeImages = useMemo(() => images ?? [], [images]);
  const [index, setIndex] = useState(Math.min(Math.max(initialIndex, 0), Math.max(0, safeImages.length - 1)));

  useEffect(() => {
    if (!visible) return;
    const nextIndex = Math.min(Math.max(initialIndex, 0), Math.max(0, safeImages.length - 1));
    setIndex(nextIndex);

    // Scroll after modal renders
    const t = setTimeout(() => {
      scrollRef.current?.scrollTo({ x: nextIndex * SCREEN_W, y: 0, animated: false });
    }, 50);
    return () => clearTimeout(t);
  }, [visible, initialIndex, safeImages.length]);

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const next = Math.round(x / SCREEN_W);
    setIndex(next);
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      presentationStyle={Platform.OS === 'ios' ? 'overFullScreen' : 'fullScreen'}
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={st.root}>
        <View style={[st.topBar, { paddingTop: insets.top + 8 }]}> 
          <Pressable onPress={onClose} style={({ pressed }) => [st.iconBtn, pressed && { opacity: 0.7 }]}>
            <Ionicons name="close" size={22} color="#fff" />
          </Pressable>

          <View style={st.topBarCenter} />

          <View style={st.counterWrap}>
            <Text style={st.counterText}>
              {safeImages.length > 0 ? `${index + 1}/${safeImages.length}` : ''}
            </Text>
          </View>
        </View>

        <ScrollView
          ref={(r) => { scrollRef.current = r; }}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onScrollEnd}
          contentContainerStyle={st.scroller}
        >
          {safeImages.map((uri, i) => (
            <View key={`${uri}-${i}`} style={st.page}>
              <Image source={{ uri }} style={st.image} resizeMode="contain" />
            </View>
          ))}
        </ScrollView>

        <View style={[st.bottomSafe, { height: insets.bottom + 10 }]} />
      </View>
    </Modal>
  );
}

const st = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 14,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  topBarCenter: {
    flex: 1,
  },
  counterWrap: {
    minWidth: 60,
    height: 32,
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  scroller: {
    alignItems: 'center',
  },
  page: {
    width: SCREEN_W,
    height: SCREEN_H,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 54,
  },
  image: {
    width: SCREEN_W,
    height: SCREEN_H,
  },
  bottomSafe: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});
