import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";

import api from "../api"; // Assuming you have an 'api' module for making API calls

export default function PaymentConfirmation({ route }) {
  const navigation = useNavigation();
  const { bookingReference, fullName } = route.params; // Receive data from the previous page
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const passengerName = fullName
  console.log("P: ", passengerName, "FN", fullName);
  

  useEffect(() => {
    navigation.setOptions({ headerShown: false });

    const fetchBookingDetails = async () => {
      setLoading(true);

      try {
        // Sending the booking reference and passenger name to the backend
        const response = await api.post("/bookings/ref", {
          bookingReference,
          passengerName,
        });


        console.log(passengerName, bookingReference);
        

        // Storing the booking details in state
        setBookingDetails(response.data.booking);
      } catch (error) {
        console.error("Error fetching booking details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingReference, passengerName]);

  const handleHomePress = () => {
    // Navigate to home or any other page after confirmation
    navigation.navigate("Home");
  };

  if (loading) {
    return (
      <Modal transparent={true} visible={loading}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#EDE7E3" />
          <Text style={styles.loadingText}>Fetching Booking Details...</Text>
        </View>
      </Modal>
    );
  }

  return (
    <LinearGradient colors={["#16697A", "#489FB5"]} style={styles.container}>
      <View style={styles.contentContainer}>
        {/* Icon and Confirmation Text */}
        <View style={styles.iconContainer}>
          <AntDesign name="checkcircle" size={80} color="#EDE7E3" />
        </View>

        <Text style={styles.title}>Booking Confirmed!</Text>
        <Text style={styles.subTitle}>Your flight booking is complete.</Text>

        {/* Passenger Name and Booking Reference */}
        <View style={styles.infoContainer}>
          <Text style={styles.boldText}>Passenger:</Text>
          <Text style={styles.infoText}>{passengerName}</Text>
          <Text style={styles.boldText}>Booking Reference:</Text>
          <Text style={styles.infoText}>{bookingReference}</Text>
        </View>

        {/* Flight Information */}
        {bookingDetails && (
          <View style={styles.flightInfoContainer}>
            <Text style={styles.flightInfoText}>
              <Text style={styles.bold}>Flight Number:</Text>{" "}
              {bookingDetails.flight.flight_number}
            </Text>
            <Text style={styles.flightInfoText}>
              <Text style={styles.bold}>From:</Text>{" "}
              {bookingDetails.flight.origin.name} (
              {bookingDetails.flight.origin.code})
            </Text>
            <Text style={styles.flightInfoText}>
              <Text style={styles.bold}>To:</Text>{" "}
              {bookingDetails.flight.destination.name} (
              {bookingDetails.flight.destination.code})
            </Text>
            <Text style={styles.flightInfoText}>
              <Text style={styles.bold}>Departure:</Text>{" "}
              {new Date(bookingDetails.flight.departure_time).toLocaleString()}
            </Text>
          </View>
        )}

        {/* Payment Method */}
        {bookingDetails && (
          <View style={styles.paymentInfoContainer}>
            <Text style={styles.paymentTitle}>Payment Method:</Text>
            <Text style={styles.paymentInfo}>
              {bookingDetails.payment.method} (****
              {bookingDetails.payment.amount.slice(-4)})
            </Text>
          </View>
        )}

        {/* Go to Home Button */}
        <TouchableOpacity style={styles.button} onPress={handleHomePress}>
          <Text style={styles.buttonText}>Go to Home</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  contentContainer: {
    width: "100%",
    maxWidth: 450,
    padding: 30,
    backgroundColor: "#EDE7E3",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 15,
    alignItems: "center",
  },
  iconContainer: {
    backgroundColor: "#16697A",
    padding: 25,
    borderRadius: 50,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#16697A",
    textAlign: "center",
    marginBottom: 10,
    fontFamily: "Poppins",
  },
  subTitle: {
    fontSize: 18,
    color: "#16697A",
    textAlign: "center",
    marginBottom: 30,
    fontFamily: "Poppins",
    opacity: 0.8,
  },
  infoContainer: {
    marginBottom: 20,
    alignItems: "flex-start",
    width: "100%",
  },
  boldText: {
    fontSize: 16,
    color: "#16697A",
    fontWeight: "bold",
    marginBottom: 5,
  },
  infoText: {
    fontSize: 16,
    color: "#489FB5",
    marginBottom: 15,
  },
  flightInfoContainer: {
    marginBottom: 20,
    alignItems: "flex-start",
    width: "100%",
  },
  flightInfoText: {
    fontSize: 16,
    color: "#16697A",
    marginBottom: 8,
    fontFamily: "Poppins",
  },
  bold: {
    fontWeight: "bold",
  },
  paymentInfoContainer: {
    marginBottom: 20,
    alignItems: "flex-start",
    width: "100%",
  },
  paymentTitle: {
    fontSize: 18,
    color: "#16697A",
    fontWeight: "bold",
    marginBottom: 5,
    fontFamily: "Poppins",
  },
  paymentInfo: {
    fontSize: 16,
    color: "#16697A",
    fontFamily: "Poppins",
  },
  button: {
    backgroundColor: "#489FB5",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginTop: 30,
    alignItems: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Poppins",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  loadingText: {
    fontSize: 18,
    color: "#EDE7E3",
    marginTop: 10,
    fontFamily: "Poppins",
  },
});
