// src/screens/FlightDetailsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import api from '../api';

export default function FlightDetailsScreen({ route, navigation }) {
  const { flightId } = route.params;
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlightDetails = async () => {
      try {
        const response = await api.get(`/flights/${flightId}`);
        setFlight(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching flight details:', error);
        setLoading(false);
      }
    };

    fetchFlightDetails();
  }, [flightId]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Flight Details</Text>
      <Text>From: {flight.origin.code}</Text>
      <Text>To: {flight.destination.code}</Text>
      <Text>Departure: {new Date(flight.departure_time).toLocaleString()}</Text>
      <Text>Status: {flight.status}</Text>

      <Button title="Book Now" onPress={() => navigation.navigate('Booking', { flightId })} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  heading: { fontSize: 24, marginBottom: 20 },
});
