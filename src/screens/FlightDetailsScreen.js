import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  Modal,
  ScrollView,ActivityIndicator
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import api from "../api";
import { Ionicons } from "react-native-vector-icons";

export default function FlightDetailsScreen({ route, navigation }) {
  const { flightId, price } = route.params;
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false); // State to control modal visibility
  const [selectedClass, setSelectedClass] = useState(null); // State to store selected class (Economy or Business)

  useEffect(() => {
    const fetchFlightDetails = async () => {
      try {
        const response = await api.get(`/flights/${flightId}`);
        setFlight(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching flight details:", error);
        setLoading(false);
      }
    };

    fetchFlightDetails();
  }, [flightId]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, // Hides the default header
    });
  }, [navigation]);

  const handleBookNow = () => {
    // Show the modal when the "Book Now" button is pressed
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    // Close the modal when the "Close" button is pressed
    setIsModalVisible(false);
  };

  const handleSelectClass = (seatClassId) => {
    // Store selected class and close modal
    setSelectedClass(seatClassId);
    setIsModalVisible(false);
    // Find the selected seat class from the fetched flight data
    const selectedSeatClass = flight.flightSeats.find(
      (seat) => seat.seatClass.id === seatClassId
    );

    // Send selected flight data along with the seat class
    const selectedFlight = {
      seatClassId: selectedSeatClass.seatClass.id,
      flightId: flight.id,
    };
    console.log("Selected Flight Data:", selectedFlight);
    // Optionally, navigate to booking screen with selectedFlight data
    navigation.navigate("Booking", { selectedFlight });
  };

  if (loading) {
    return (
      <LinearGradient colors={['#16697A', '#489FB5']} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFA62B" />
        <Text style={styles.loadingText}>Loading flights Details...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#16697A", "#489FB5"]} style={styles.container}>
      {/* Header Section with Back Button and Flight Details */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#EDE7E3" />
        </TouchableOpacity>
        <Text style={styles.heading}>Flight Details</Text>
      </View>

      {/* ScrollView for centering the rest of the content */}
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.flightInfoContainer}>
          <Text style={styles.flightInfoLabel}>From:</Text>
          <Text style={styles.flightInfoValue}>
            {flight.origin.name} ({flight.origin.code})
          </Text>
        </View>

        <View style={styles.flightInfoContainer}>
          <Text style={styles.flightInfoLabel}>To:</Text>
          <Text style={styles.flightInfoValue}>
            {flight.destination.name} ({flight.destination.code})
          </Text>
        </View>

        <View style={styles.flightInfoContainer}>
          <Text style={styles.flightInfoLabel}>Departure:</Text>
          <Text style={styles.flightInfoValue}>
            {new Date(flight.departure_time).toLocaleString()}
          </Text>
        </View>

        <View style={styles.flightInfoContainer}>
          <Text style={styles.flightInfoLabel}>Arrival:</Text>
          <Text style={styles.flightInfoValue}>
            {new Date(flight.arrival_time).toLocaleString()}
          </Text>
        </View>

        <View style={styles.flightInfoContainer}>
          <Text style={styles.flightInfoLabel}>Status:</Text>
          <Text style={styles.flightInfoValue}>{flight.status}</Text>
        </View>

        {/* Book Now Button */}
        <View style={styles.buttonContainer}>
          <Button title="Book Now" onPress={handleBookNow} color="#FFA62B" />
        </View>
      </ScrollView>

      {/* Modal for selecting class */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Seat Class</Text>
            {/* Economy Class Button */}
            <Button
              title={`Economy Class - $${flight.base_price}`}
              onPress={() =>
                handleSelectClass(flight.flightSeats[1].seatClass.id)
              } // Economy seatClassId
              color="#16697A"
            />
            {/* Business Class Button */}
            <Button
              title={`Business Class - $${(flight.base_price * 2).toFixed(2)}`} // Multiply by 2 for Business class price
              onPress={() =>
                handleSelectClass(flight.flightSeats[0].seatClass.id)
              } // Business seatClassId
              color="#16697A"
            />
            <Button title="Close" onPress={handleCloseModal} color="#FFA62B" />
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    color: "#EDE7E3",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#EDE7E3",
    textAlign: "center",
    flex: 1,
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: "center", // Vertically center the content
    paddingBottom: 40, // Ensure the button is not cut off
  },
  flightInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 10,
  },
  flightInfoLabel: {
    fontSize: 18,
    color: "#EDE7E3",
    fontWeight: "bold",
  },
  flightInfoValue: {
    fontSize: 18,
    color: "#EDE7E3",
    flex: 1,
    textAlign: "right",
  },
  buttonContainer: {
    marginTop: 30,
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "#EDE7E3",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#16697A",
    marginBottom: 10,
  },
});
