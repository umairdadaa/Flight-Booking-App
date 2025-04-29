import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import api from "../api"; // Adjust the path if needed
import { Ionicons } from "react-native-vector-icons";


export default function ViewBookingScreen() {
  const navigation = useNavigation();

  const [passengerName, setPassengerName] = useState("");
  const [bookingReference, setBookingReference] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [error, setError] = useState("");

  const handleGetBooking = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.post("/bookings/ref", {
        bookingReference,
        passengerName,
      });
      setBookingData(response.data.booking);
    } catch (err) {
      console.log(err);
      setError("Failed to fetch booking. Please check your details.");
    }
    setLoading(false);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <LinearGradient colors={["#16697A", "#489FB5"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#EDE7E3" />
          </TouchableOpacity>
          <Text style={styles.title}>View Booking</Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <TextInput
            placeholder="Passenger Name"
            placeholderTextColor="#aaa"
            style={styles.input}
            value={passengerName}
            onChangeText={setPassengerName}
          />
          <TextInput
            placeholder="Booking Reference"
            placeholderTextColor="#aaa"
            style={styles.input}
            value={bookingReference}
            onChangeText={setBookingReference}
          />
          <TouchableOpacity style={styles.button} onPress={handleGetBooking} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Get My Booking</Text>
            )}
          </TouchableOpacity>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        {/* Booking Data */}
        {bookingData && (
          <View style={styles.bookingContainer}>
            <Text style={styles.sectionTitle}>Booking Details</Text>
            <Text style={styles.detail}>Booking Reference: {bookingData.booking_reference}</Text>
            <Text style={styles.detail}>Status: {bookingData.status}</Text>
            <Text style={styles.detail}>Total Price: ${bookingData.total_price}</Text>
            <Text style={styles.detail}>Booked At: {new Date(bookingData.booked_at).toLocaleString()}</Text>

            <Text style={styles.sectionTitle}>Flight Details</Text>
            <Text style={styles.detail}>Flight Number: {bookingData.flight.flight_number}</Text>
            <Text style={styles.detail}>Airline: {bookingData.flight.airline.name}</Text>
            <Text style={styles.detail}>From: {bookingData.flight.origin.city} ({bookingData.flight.origin.code})</Text>
            <Text style={styles.detail}>To: {bookingData.flight.destination.city} ({bookingData.flight.destination.code})</Text>
            <Text style={styles.detail}>Departure: {new Date(bookingData.flight.departure_time).toLocaleString()}</Text>
            <Text style={styles.detail}>Arrival: {new Date(bookingData.flight.arrival_time).toLocaleString()}</Text>

            <Text style={styles.sectionTitle}>Payment</Text>
            <Text style={styles.detail}>Method: {bookingData.payment.method}</Text>
            <Text style={styles.detail}>Status: {bookingData.payment.status}</Text>
            <Text style={styles.detail}>Paid At: {new Date(bookingData.payment.paid_at).toLocaleString()}</Text>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 60,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 30,
  },
  backButton: {
    // backgroundColor: "#EDE7E3",
    padding: 10,
    borderRadius: 50,
  },
  backButtonText: {
    fontSize: 26,
    color: "#16697A",
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: "#EDE7E3",
    marginLeft: 20,
  },
  formContainer: {
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#EDE7E3",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
    color: "#333",
  },
  button: {
    backgroundColor: "#FFA62B",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  errorText: {
    color: "red",
    marginTop: 10,
    textAlign: "center",
  },
  bookingContainer: {
    backgroundColor: "#ffffffcc",
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#16697A",
    marginBottom: 10,
    marginTop: 10,
  },
  detail: {
    fontSize: 16,
    marginBottom: 6,
    color: "#333",
  },
});
