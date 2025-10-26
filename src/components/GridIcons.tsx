import React from 'react';
import { View, StyleSheet } from 'react-native';

interface GridIconProps {
  size?: number;
}

export const Grid1x2Icon: React.FC<GridIconProps> = ({ size = 60 }) => (
  <View style={[styles.container, { width: size, height: size }]}>
    <View style={[styles.line, styles.verticalLine, { left: size / 2 }]} />
  </View>
);

export const Grid2x1Icon: React.FC<GridIconProps> = ({ size = 60 }) => (
  <View style={[styles.container, { width: size, height: size }]}>
    <View style={[styles.line, styles.horizontalLine, { top: size / 2 }]} />
  </View>
);

export const Grid1x3Icon: React.FC<GridIconProps> = ({ size = 60 }) => (
  <View style={[styles.container, { width: size, height: size }]}>
    <View style={[styles.line, styles.verticalLine, { left: size / 3 }]} />
    <View style={[styles.line, styles.verticalLine, { left: (size * 2) / 3 }]} />
  </View>
);

export const Grid3x1Icon: React.FC<GridIconProps> = ({ size = 60 }) => (
  <View style={[styles.container, { width: size, height: size }]}>
    <View style={[styles.line, styles.horizontalLine, { top: size / 3 }]} />
    <View style={[styles.line, styles.horizontalLine, { top: (size * 2) / 3 }]} />
  </View>
);

export const Grid2x2Icon: React.FC<GridIconProps> = ({ size = 60 }) => (
  <View style={[styles.container, { width: size, height: size }]}>
    <View style={[styles.line, styles.verticalLine, { left: size / 2 }]} />
    <View style={[styles.line, styles.horizontalLine, { top: size / 2 }]} />
  </View>
);

export const Grid2x3Icon: React.FC<GridIconProps> = ({ size = 60 }) => (
  <View style={[styles.container, { width: size, height: size }]}>
    <View style={[styles.line, styles.verticalLine, { left: size / 2 }]} />
    <View style={[styles.line, styles.horizontalLine, { top: size / 3 }]} />
    <View style={[styles.line, styles.horizontalLine, { top: (size * 2) / 3 }]} />
  </View>
);

export const Grid3x2Icon: React.FC<GridIconProps> = ({ size = 60 }) => (
  <View style={[styles.container, { width: size, height: size }]}>
    <View style={[styles.line, styles.verticalLine, { left: size / 3 }]} />
    <View style={[styles.line, styles.verticalLine, { left: (size * 2) / 3 }]} />
    <View style={[styles.line, styles.horizontalLine, { top: size / 2 }]} />
  </View>
);

export const Grid3x3Icon: React.FC<GridIconProps> = ({ size = 60 }) => (
  <View style={[styles.container, { width: size, height: size }]}>
    <View style={[styles.line, styles.verticalLine, { left: size / 3 }]} />
    <View style={[styles.line, styles.verticalLine, { left: (size * 2) / 3 }]} />
    <View style={[styles.line, styles.horizontalLine, { top: size / 3 }]} />
    <View style={[styles.line, styles.horizontalLine, { top: (size * 2) / 3 }]} />
  </View>
);

export const Grid1x4Icon: React.FC<GridIconProps> = ({ size = 60 }) => (
  <View style={[styles.container, { width: size, height: size }]}>
    <View style={[styles.line, styles.verticalLine, { left: size / 4 }]} />
    <View style={[styles.line, styles.verticalLine, { left: size / 2 }]} />
    <View style={[styles.line, styles.verticalLine, { left: (size * 3) / 4 }]} />
  </View>
);

export const Grid4x1Icon: React.FC<GridIconProps> = ({ size = 60 }) => (
  <View style={[styles.container, { width: size, height: size }]}>
    <View style={[styles.line, styles.horizontalLine, { top: size / 4 }]} />
    <View style={[styles.line, styles.horizontalLine, { top: size / 2 }]} />
    <View style={[styles.line, styles.horizontalLine, { top: (size * 3) / 4 }]} />
  </View>
);

export const Grid2x4Icon: React.FC<GridIconProps> = ({ size = 60 }) => (
  <View style={[styles.container, { width: size, height: size }]}>
    <View style={[styles.line, styles.verticalLine, { left: size / 2 }]} />
    <View style={[styles.line, styles.horizontalLine, { top: size / 4 }]} />
    <View style={[styles.line, styles.horizontalLine, { top: size / 2 }]} />
    <View style={[styles.line, styles.horizontalLine, { top: (size * 3) / 4 }]} />
  </View>
);

export const Grid4x2Icon: React.FC<GridIconProps> = ({ size = 60 }) => (
  <View style={[styles.container, { width: size, height: size }]}>
    <View style={[styles.line, styles.verticalLine, { left: size / 4 }]} />
    <View style={[styles.line, styles.verticalLine, { left: size / 2 }]} />
    <View style={[styles.line, styles.verticalLine, { left: (size * 3) / 4 }]} />
    <View style={[styles.line, styles.horizontalLine, { top: size / 2 }]} />
  </View>
);

export const Grid2x5Icon: React.FC<GridIconProps> = ({ size = 60 }) => (
  <View style={[styles.container, { width: size, height: size }]}>
    <View style={[styles.line, styles.verticalLine, { left: size / 5 }]} />
    <View style={[styles.line, styles.verticalLine, { left: (size * 2) / 5 }]} />
    <View style={[styles.line, styles.verticalLine, { left: (size * 3) / 5 }]} />
    <View style={[styles.line, styles.verticalLine, { left: (size * 4) / 5 }]} />
    <View style={[styles.line, styles.horizontalLine, { top: size / 2 }]} />
  </View>
);

export const Grid5x2Icon: React.FC<GridIconProps> = ({ size = 60 }) => (
  <View style={[styles.container, { width: size, height: size }]}>
    <View style={[styles.line, styles.verticalLine, { left: size / 2 }]} />
    <View style={[styles.line, styles.horizontalLine, { top: size / 5 }]} />
    <View style={[styles.line, styles.horizontalLine, { top: (size * 2) / 5 }]} />
    <View style={[styles.line, styles.horizontalLine, { top: (size * 3) / 5 }]} />
    <View style={[styles.line, styles.horizontalLine, { top: (size * 4) / 5 }]} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    borderRadius: 0,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  line: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
  },
  verticalLine: {
    width: 1,
    height: '100%',
  },
  horizontalLine: {
    height: 1,
    width: '100%',
  },
});
