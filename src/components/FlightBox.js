import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const FlightBox = ({ flight }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.duration}>{flight.duration}</Text>
        <View style={styles.airlineLogo}>
          <Text style={styles.airlineText}>{flight.airlineLogo}</Text>
        </View>
      </View>

      <View style={styles.route}>
        <View style={styles.airport}>
          <Text style={styles.airportCode}>{flight.departureCode}</Text>
          <Text style={styles.airportCity}>{flight.departureCity}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.airport}>
          <Text style={styles.airportCode}>{flight.arrivalCode}</Text>
          <Text style={styles.airportCity}>{flight.arrivalCity}</Text>
        </View>
      </View>

      <View style={styles.details}>
        <View>
          <Text style={styles.detailLabel}>DATE & TIME</Text>
          <Text style={styles.detailValue}>{flight.date}</Text>
        </View>
        <View>
          <Text style={styles.detailLabel}>FLIGHT NUMBER</Text>
          <Text style={styles.detailValue}>{flight.flightNumber}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.bookButton}>
        <Text style={styles.bookButtonText}>Book Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  duration: {
    fontSize: 16,
    fontWeight: "bold",
  },
  airlineLogo: {
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  airlineText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  route: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  airport: {
    flex: 1,
  },
  airportCode: {
    fontSize: 24,
    fontWeight: "bold",
  },
  airportCity: {
    fontSize: 14,
    color: "#666",
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 8,
  },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  bookButton: {
    backgroundColor: "#0066cc",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  bookButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default FlightBox;
