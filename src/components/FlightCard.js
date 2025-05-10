import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "react-native-vector-icons";

export default function FlightCard({ flight, onPress }) {
  const formatTime = (iso) => {
    return new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateDuration = (departureTime, arrivalTime) => {
    const departure = new Date(departureTime);
    const arrival = new Date(arrivalTime);
    const duration = new Date(arrival - departure);
    const hours = duration.getUTCHours();
    const minutes = duration.getUTCMinutes();
    return `${hours}h ${minutes}m`;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardHeader}>
        {flight.airline.logo && (
          <Image source={{ uri: flight.airline.logo }} style={styles.logo} />
        )}
        <Text style={styles.airlineName}>{flight.airline.name}</Text>
        <Text style={styles.flightNumber}>{flight.flight_number}</Text>
      </View>

      <View style={styles.routeContainer}>
        <View style={styles.timeBlock}>
          <Text style={styles.time}>{formatTime(flight.departure_time)}</Text>
          <Text style={styles.airportCode}>{flight.origin.code}</Text>
        </View>

        <View style={styles.durationContainer}>
          <View style={styles.durationLine} />
          <Text style={styles.durationText}>
            {calculateDuration(flight.departure_time, flight.arrival_time)}
          </Text>
          <View style={styles.durationLine} />
        </View>

        <View style={styles.timeBlock}>
          <Text style={styles.time}>{formatTime(flight.arrival_time)}</Text>
          <Text style={styles.airportCode}>{flight.destination.code}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Price from</Text>
          <Text style={styles.price}>
            ${Number(flight.base_price).toFixed(2)}
          </Text>
        </View>

        <View style={styles.detailsButton}>
          <Text style={styles.detailsButtonText}>Details</Text>
          <Ionicons name="chevron-forward" size={16} color="#EDE7E3" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#EDE7E3",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#16697A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  airlineName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#16697A",
    marginRight: 8,
  },
  flightNumber: {
    fontSize: 14,
    color: "#489FB5",
    fontWeight: "500",
  },
  routeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  timeBlock: {
    alignItems: "center",
    flex: 1,
  },
  time: {
    fontSize: 20,
    fontWeight: "700",
    color: "#16697A",
    marginBottom: 4,
    textAlign: "center",
  },
  airportCode: {
    fontSize: 14,
    fontWeight: "600",
    color: "#489FB5",
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  durationLine: {
    height: 1,
    backgroundColor: "#489FB5",
    flex: 1,
    opacity: 0.5,
  },
  durationText: {
    fontSize: 12,
    color: "#16697A",
    marginHorizontal: 8,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#489FB5",
    opacity: 0.2,
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceContainer: {
    flexDirection: "column",
  },
  priceLabel: {
    fontSize: 12,
    color: "#489FB5",
    marginBottom: 2,
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFA62B",
  },
  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#489FB5",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  detailsButtonText: {
    color: "#EDE7E3",
    fontWeight: "600",
    fontSize: 14,
    marginRight: 4,
  },
});
