import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function FlightCard({ flight, onPress }) {
  // Format date and time
  const formatDateTime = (iso) => {
    const date = new Date(iso);
    return date.toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  // Calculate flight duration in hours and minutes
  const calculateDuration = (departureTime, arrivalTime) => {
    const departure = new Date(departureTime);
    const arrival = new Date(arrivalTime);
    const duration = new Date(arrival - departure);
    const hours = duration.getUTCHours();
    const minutes = duration.getUTCMinutes();
    return `${hours}hrs ${minutes}min`;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {/* Airline Logo */}
      {flight.airline.logo && (
        <Image source={{ uri: flight.airline.logo }} style={styles.logo} />
      )}
      
      <Text style={styles.airline}>
        {flight.airline.name} ({flight.flight_number})
      </Text>

      <View style={styles.routeRow}>
        <Text style={styles.city}>
          {flight.origin.city} ({flight.origin.code})
        </Text>
        <Text style={styles.arrow}>→</Text>
        <Text style={styles.city}>
          {flight.destination.city} ({flight.destination.code})
        </Text>
      </View>

      <Text style={styles.detail}>
        Departure: <Text style={styles.highlight}>{formatDateTime(flight.departure_time)}</Text>
      </Text>
      <Text style={styles.detail}>
        Arrival: <Text style={styles.highlight}>{formatDateTime(flight.arrival_time)}</Text>
      </Text>

      {/* Flight Duration */}
      <Text style={styles.detail}>
        Duration: <Text style={styles.highlight}>{calculateDuration(flight.departure_time, flight.arrival_time)}</Text>
      </Text>

      <Text style={styles.detail}>
        Price: <Text style={styles.highlight}>$ {flight.base_price}</Text>
      </Text>

      <Text style={styles.detail}>
        Seats:{" "}
        {flight.flightSeats.map((seat) => (
          <Text key={seat.id} style={styles.seatInfo}>
            {seat.seatClass.name} ({seat.available_seats}){" "}
          </Text>
        ))}
      </Text>

      <View style={styles.buttonWrapper}>
        <Text style={styles.buttonText}>View Details</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#489FB5', // Light Teal
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 10,
    alignSelf: 'center',
  },
  airline: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#EDE7E3', // Light Beige
    marginBottom: 8,
    textAlign: 'center',
  },
  routeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  city: {
    fontSize: 16,
    fontWeight: '600',
    color: '#16697A', // Dark Teal
  },
  arrow: {
    marginHorizontal: 8,
    fontSize: 18,
    color: '#16697A', // Dark Teal
  },
  detail: {
    fontSize: 14,
    color: '#16697A', // Dark Teal
    marginBottom: 4,
  },
  highlight: {
    fontWeight: 'bold',
    color: '#FFA62B', // Yellow-Orange
  },
  seatInfo: {
    fontWeight: '600',
    color: '#16697A', // Dark Teal
  },
  buttonWrapper: {
    marginTop: 12,
    backgroundColor: '#FFA62B', // Yellow-Orange
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#EDE7E3', // Light Beige
    fontWeight: 'bold',
    fontSize: 14,
  },
});
