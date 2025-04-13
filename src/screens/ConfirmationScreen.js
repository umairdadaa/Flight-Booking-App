// src/screens/ConfirmationScreen.js
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function ConfirmationScreen({ route, navigation }) {
  const { bookingId } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Booking Confirmed</Text>
      <Text>Your booking ID is {bookingId}</Text>
      <Button title="Back to Home" onPress={() => navigation.navigate('Home')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  heading: { fontSize: 24, marginBottom: 20 },
});
