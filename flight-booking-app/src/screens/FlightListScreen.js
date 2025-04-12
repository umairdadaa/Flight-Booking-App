import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from 'react-native-vector-icons'; // Import Ionicons
import api from '../api';
import FlightCard from '../components/FlightCard';

export default function FlightListScreen({ route, navigation }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, 
    });
  }, [navigation]);

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
    return (
      <LinearGradient colors={['#16697A', '#489FB5']} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFA62B" />
        <Text style={styles.loadingText}>Loading flights...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#16697A', '#489FB5']} style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#EDE7E3" />
        </TouchableOpacity>
        <Text style={styles.heading}>Available Flights</Text>
      </View>
      {flights.length === 0 ? (
        <Text style={styles.noFlightsText}>No flights found for this search.</Text>
      ) : (
        <View style={styles.listContainer}>
          <FlatList
            data={flights}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <FlightCard
                flight={item}
                onPress={() =>
                  navigation.navigate('FlightDetails', { flightId: item.id, price: item.price, })
                }
              />
            )}
            contentContainerStyle={styles.flatListContent}
          />
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 75,
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#EDE7E3',
    fontSize: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#EDE7E3',
    textAlign: 'center',
    flex: 1,
  },
  listContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  flatListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  noFlightsText: {
    fontSize: 16,
    color: '#EDE7E3',
    textAlign: 'center',
    marginTop: 20,
  },
});
