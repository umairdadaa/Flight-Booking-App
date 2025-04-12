// src/components/FlightCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function FlightCard({ flight, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View>
        <Text style={styles.text}>Flight {flight.id}</Text>
        <Text style={styles.text}>From: {flight.origin.code}</Text>
        <Text style={styles.text}>To: {flight.destination.code}</Text>
        <Text style={styles.text}>Departure: {new Date(flight.departure_time).toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  text: { fontSize: 16, marginVertical: 3 },
});
