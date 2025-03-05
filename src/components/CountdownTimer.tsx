import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatCountdown } from '../utils/dateUtils';

type CountdownTimerProps = {
  endTime: string;
  onExpire?: () => void;
};

const CountdownTimer = ({ endTime, onExpire }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(formatCountdown(endTime));
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const end = new Date(endTime);
    const now = new Date();
    
    // Check if already expired
    if (end <= now) {
      setTimeLeft('00:00:00');
      setIsExpired(true);
      onExpire && onExpire();
      return;
    }

    // Update timer every second
    const interval = setInterval(() => {
      const formattedTime = formatCountdown(endTime);
      setTimeLeft(formattedTime);
      
      // Check if timer has expired
      if (formattedTime === '00:00:00' && !isExpired) {
        setIsExpired(true);
        onExpire && onExpire();
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime, onExpire, isExpired]);

  return (
    <View style={styles.container}>
      <Text style={[styles.timer, isExpired && styles.expired]}>{timeLeft}</Text>
      {isExpired && <Text style={styles.expiredText}>Time's up!</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 8,
  },
  timer: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200ee',
    fontVariant: ['tabular-nums'],
  },
  expired: {
    color: '#f44336',
  },
  expiredText: {
    color: '#f44336',
    marginTop: 4,
    fontSize: 14,
  },
});

export default CountdownTimer; 