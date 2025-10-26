import React from 'react';
import { View, StyleSheet } from 'react-native';

interface IconProps {
  size?: number;
  color?: string;
}

export const InstagramIcon: React.FC<IconProps> = ({ size = 24, color = '#E4405F' }) => (
  <View style={[styles.container, { width: size, height: size }]}>
    <View style={[styles.instagramOuter, { borderColor: color }]}>
      <View style={[styles.instagramInner, { backgroundColor: color }]} />
      <View style={[styles.instagramDot, { backgroundColor: color }]} />
    </View>
  </View>
);

export const XIcon: React.FC<IconProps> = ({ size = 24, color = '#000000' }) => (
  <View style={[styles.container, { width: size, height: size }]}>
    <View style={[styles.xLine1, { backgroundColor: color }]} />
    <View style={[styles.xLine2, { backgroundColor: color }]} />
  </View>
);

export const YouTubeIcon: React.FC<IconProps> = ({ size = 24, color = '#FF0000' }) => (
  <View style={[styles.container, { width: size, height: size }]}>
    <View style={[styles.youtubeOuter, { backgroundColor: color }]}>
      <View style={styles.youtubePlay} />
    </View>
  </View>
);

export const FacebookIcon: React.FC<IconProps> = ({ size = 24, color = '#1877F2' }) => (
  <View style={[styles.container, { width: size, height: size }]}>
    <View style={[styles.facebookOuter, { backgroundColor: color }]}>
      <View style={styles.facebookInner} />
    </View>
  </View>
);

export const CustomIcon: React.FC<IconProps> = ({ size = 24, color = '#666666' }) => (
  <View style={[styles.container, { width: size, height: size }]}>
    <View style={[styles.customRuler, { backgroundColor: color }]} />
    <View style={[styles.customMark1, { backgroundColor: color }]} />
    <View style={[styles.customMark2, { backgroundColor: color }]} />
    <View style={[styles.customMark3, { backgroundColor: color }]} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Instagram Icon
  instagramOuter: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instagramInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  instagramDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
  // X Icon
  xLine1: {
    position: 'absolute',
    width: 16,
    height: 2,
    transform: [{ rotate: '45deg' }],
  },
  xLine2: {
    position: 'absolute',
    width: 16,
    height: 2,
    transform: [{ rotate: '-45deg' }],
  },
  // YouTube Icon
  youtubeOuter: {
    width: 20,
    height: 14,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  youtubePlay: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 0,
    borderTopWidth: 4,
    borderBottomWidth: 4,
    borderLeftColor: '#FFFFFF',
    borderRightColor: 'transparent',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    marginLeft: 2,
  },
  // Facebook Icon
  facebookOuter: {
    width: 20,
    height: 20,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  facebookInner: {
    width: 8,
    height: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
  },
  // Custom Icon (Ruler)
  customRuler: {
    width: 16,
    height: 2,
  },
  customMark1: {
    position: 'absolute',
    top: 4,
    left: 2,
    width: 1,
    height: 4,
  },
  customMark2: {
    position: 'absolute',
    top: 4,
    left: 8,
    width: 1,
    height: 4,
  },
  customMark3: {
    position: 'absolute',
    top: 4,
    right: 2,
    width: 1,
    height: 4,
  },
});
