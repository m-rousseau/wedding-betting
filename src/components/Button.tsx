import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';

type ButtonProps = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  mode?: 'primary' | 'secondary' | 'outline';
  style?: ViewStyle;
  textStyle?: TextStyle;
};

const Button = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  mode = 'primary',
  style,
  textStyle,
}: ButtonProps) => {
  const getButtonStyle = () => {
    if (mode === 'primary') {
      return [styles.button, styles.primaryButton, disabled && styles.disabledButton, style];
    } else if (mode === 'secondary') {
      return [styles.button, styles.secondaryButton, disabled && styles.disabledButton, style];
    } else {
      return [styles.button, styles.outlineButton, disabled && styles.disabledOutlineButton, style];
    }
  };

  const getTextStyle = () => {
    if (mode === 'primary') {
      return [styles.text, styles.primaryText, disabled && styles.disabledText, textStyle];
    } else if (mode === 'secondary') {
      return [styles.text, styles.secondaryText, disabled && styles.disabledText, textStyle];
    } else {
      return [styles.text, styles.outlineText, disabled && styles.disabledOutlineText, textStyle];
    }
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator size="small" color={mode === 'outline' ? '#6200ee' : '#fff'} />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  primaryButton: {
    backgroundColor: '#6200ee',
  },
  secondaryButton: {
    backgroundColor: '#03dac6',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#6200ee',
  },
  disabledButton: {
    backgroundColor: '#e0e0e0',
  },
  disabledOutlineButton: {
    borderColor: '#bdbdbd',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryText: {
    color: '#fff',
  },
  secondaryText: {
    color: '#000',
  },
  outlineText: {
    color: '#6200ee',
  },
  disabledText: {
    color: '#9e9e9e',
  },
  disabledOutlineText: {
    color: '#bdbdbd',
  },
});

export default Button; 