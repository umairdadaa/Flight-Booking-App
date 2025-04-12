// src/screens/FlightListScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import api from '../api';
import FlightCard from '../components/FlightCard';

export default function FlightListScreen({ route, navigation }) {
  const { origin, destination, date } = route.params;
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await api.get('/flights', {
          params: { origin, destination, date },
        });
        setFlights(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching flights:", error);
        setLoading(false);
      }
    };

    fetchFlights();
  }, [origin, destination, date]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Available Flights</Text>
      <FlatList
        data={flights}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <FlightCard flight={item} onPress={() => navigation.navigate('FlightDetails', { flightId: item.id })} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  heading: { fontSize: 24, marginBottom: 20 },
});
