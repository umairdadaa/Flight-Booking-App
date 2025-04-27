import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from "@expo/vector-icons"; // For icons
import Animated, {
  Layout,
  SlideInUp,
  SlideOutDown,
} from "react-native-reanimated";
import { BlurView } from "expo-blur"; // Import BlurView

const BookingScreen = ({ navigation, route }) => {
  const { selectedFlight } = route.params || {};
  console.log(selectedFlight);

  const [passengers, setPassengers] = useState([
    { fullName: "", passportNumber: "", age: "", expanded: true },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [passengerToRemove, setPassengerToRemove] = useState(null);

  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index][field] = value;
    setPassengers(updatedPassengers);
  };

  const addPassenger = () => {
    setPassengers([
      ...passengers,
      { fullName: "", passportNumber: "", age: "", expanded: false },
    ]);
  };

  const toggleExpand = (index) => {
    const updatedPassengers = passengers.map((passenger, i) => {
      if (i === index) {
        return { ...passenger, expanded: !passenger.expanded };
      } else {
        return { ...passenger, expanded: false }; // Collapse other passengers
      }
    });
    setPassengers(updatedPassengers);
  };

  const handleBooking = () => {
    if (passengers.some((p) => !p.fullName || !p.passportNumber || !p.age)) {
      Alert.alert("Please fill out all fields for all passengers");
      return;
    }

    const bookingData = {
      flightId: selectedFlight.flightId,
      seatClassId: selectedFlight.seatClassId,
      userId: "uuid1", // Assuming we have a user ID
      passengers: passengers.map(({ expanded, ...info }) => ({
        full_name: info.fullName,
        passport_number: info.passportNumber,
        age: info.age,
      })),
      paymentMethod: "Credit Card", // Just as an example
    };

    console.log("Booking Data:", bookingData);

    Alert.alert("Success", "Your flight has been booked!");
    navigation.navigate("Home");
  };

  const removePassenger = (index) => {
    if (passengers.length > 1) {
      const updatedPassengers = passengers.filter((_, i) => i !== index);
      setPassengers(updatedPassengers);
      setModalVisible(false); // Close the modal
    } else {
      Alert.alert("Error", "You must have at least one passenger.");
    }
  };

  const openRemoveModal = (index) => {
    setPassengerToRemove(index);
    setModalVisible(true);
  };

  return (
    <LinearGradient colors={["#16697A", "#489FB5"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.title}>Passenger Details</Text>

        {passengers.map((passenger, index) => (
          <Animated.View
            key={index}
            style={styles.passengerCard}
            layout={Layout.springify()} // Smooth layout transition
            entering={SlideInUp}
            exiting={SlideOutDown}
          >
            <TouchableOpacity
              onPress={() => toggleExpand(index)}
              style={styles.passengerHeader}
              activeOpacity={0.8}
            >
              <Text style={styles.passengerTitle}>
                {passenger.fullName
                  ? passenger.fullName.split(" ")[0]
                  : `Passenger ${index + 1}`}
              </Text>
              <AntDesign
                name={passenger.expanded ? "up" : "down"}
                size={20}
                color="#EDE7E3"
              />
            </TouchableOpacity>

            {passenger.expanded && (
              <BlurView intensity={50} style={styles.passengerContent}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Full Name</Text>
                  <TextInput
                    value={passenger.fullName}
                    onChangeText={(text) =>
                      handlePassengerChange(index, "fullName", text)
                    }
                    style={styles.input}
                    placeholder="Enter full name"
                    placeholderTextColor="#aaa"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Passport Number</Text>
                  <TextInput
                    value={passenger.passportNumber}
                    onChangeText={(text) =>
                      handlePassengerChange(index, "passportNumber", text)
                    }
                    style={styles.input}
                    placeholder="Enter passport number"
                    placeholderTextColor="#aaa"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Age</Text>
                  <TextInput
                    value={passenger.age}
                    onChangeText={(text) =>
                      handlePassengerChange(index, "age", text)
                    }
                    style={styles.input}
                    placeholder="Enter age"
                    placeholderTextColor="#aaa"
                    keyboardType="numeric"
                  />
                </View>
              </BlurView>
            )}

            {/* Trash Icon to remove passenger */}
            <TouchableOpacity
              style={styles.removeIcon}
              onPress={() => openRemoveModal(index)}
            >
              <AntDesign name="delete" size={24} color="red" />
            </TouchableOpacity>
          </Animated.View>
        ))}

        <TouchableOpacity style={styles.addButton} onPress={addPassenger}>
          <Text style={styles.addButtonText}>+ Add Passenger</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleBooking}>
          <Text style={styles.buttonText}>Confirm Booking</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate("PaymentPage", {
              selectedFlight: selectedFlight,
            })
          }
        >
          <Text style={styles.buttonText}>Make Payment</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal for confirming passenger removal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Are you sure?</Text>
            <Text style={styles.modalMessage}>
              Do you want to remove this passenger?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => removePassenger(passengerToRemove)}
              >
                <Text style={styles.modalButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#EDE7E3",
    textAlign: "center",
    marginBottom: 20,
  },
  passengerCard: {
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: "#EDE7E3",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  passengerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#489FB5",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  passengerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#EDE7E3",
  },
  passengerContent: {
    padding: 20,
    backgroundColor: "transparent", // Set the background to transparent
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#333",
  },
  addButton: {
    backgroundColor: "#16697A",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginVertical: 10,
  },
  addButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#FFA62B",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  removeIcon: {
    position: "absolute",
    right: 10,
    top: 10,
    backgroundColor: "#FFF",
    padding: 5,
    borderRadius: 50,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  modalButton: {
    backgroundColor: "#489FB5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default BookingScreen;
