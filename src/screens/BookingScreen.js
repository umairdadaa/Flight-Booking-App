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
  Dimensions,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons, Ionicons, FontAwesome } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

const { width } = Dimensions.get("window");

const BookingScreen = ({ navigation, route }) => {
  const { selectedFlight } = route.params || {};
  const [passengers, setPassengers] = useState([
    { fullName: "", passportNumber: "", age: "", expanded: true },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [passengerToRemove, setPassengerToRemove] = useState(null);

  const calculateTotalPrice = () => {
    const price =
      typeof selectedFlight?.price === "number" ? selectedFlight.price : 0;
    return price * passengers.length;
  };

  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = [...passengers];
    if (field === "age") {
      value = value ? parseInt(value, 10) : "";
      if (isNaN(value)) value = "";
    }
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
    const updatedPassengers = passengers.map((passenger, i) => ({
      ...passenger,
      expanded: i === index ? !passenger.expanded : false,
    }));
    setPassengers(updatedPassengers);
  };

  const handleMakePayment = () => {
    if (passengers.some((p) => !p.fullName || !p.passportNumber || !p.age)) {
      Alert.alert(
        "Incomplete Information",
        "Please fill out all fields for all passengers"
      );
      return;
    }
    const bookingData = {
      userId: "uuid1",
      flightId: selectedFlight.flightId,
      seatClassId: selectedFlight.seatClassId,
      passengers: passengers.map(({ expanded, ...info }) => ({
        full_name: info.fullName,
        passport_number: info.passportNumber,
        age: info.age,
      })),
    };
    navigation.navigate("PaymentPage", {
      bookingData,
      full_name: bookingData.passengers[0].full_name,
    });
  };

  const confirmRemovePassenger = (index) => {
    if (passengers.length <= 1) {
      Alert.alert("Error", "You must have at least one passenger.");
      return;
    }
    setPassengers(passengers.filter((_, i) => i !== index));
    setModalVisible(false);
  };

  return (
    <LinearGradient
      colors={["#0F2027", "#203A43", "#2C5364"]}
      style={styles.container}
    >
      {/* Header */}
      <Animatable.View
        animation="fadeInDown"
        duration={800}
        style={styles.header}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-back" size={28} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Passenger Details</Text>
          <Text style={styles.subtitle}>Complete booking information</Text>
        </View>
      </Animatable.View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <Animatable.View
          animation="fadeInUp"
          duration={800}
          delay={200}
          style={styles.flightInfoCard}
        >
          <View style={styles.flightHeader}>
            <Text style={styles.flightTitle}>Flight Summary</Text>
            <Text style={styles.flightPrice}>
              $
              {typeof selectedFlight?.price === "number"
                ? selectedFlight.price.toFixed(2)
                : "0.00"}
            </Text>
          </View>
          <View style={styles.flightDetails}>
            <View style={styles.detailRow}>
              <MaterialIcons name="flight" size={20} color="#4FD3DA" />
              <Text style={styles.detailLabel}>Flight:</Text>
              <Text style={styles.detailValue}>
                #{selectedFlight?.flightDetails?.flight_number}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="airplane" size={20} color="#4FD3DA" />
              <Text style={styles.detailLabel}>Class:</Text>
              <Text style={styles.detailValue}>
                {selectedFlight?.seatClass}
              </Text>
            </View>
          </View>
        </Animatable.View>

        {/* Passenger Section */}
        <Text style={styles.sectionTitle}>Passenger Information</Text>

        {passengers.map((passenger, index) => (
          <Animatable.View
            key={index}
            animation="fadeInUp"
            duration={800}
            delay={300 + index * 100}
            style={styles.passengerCard}
          >
            <TouchableOpacity
              onPress={() => toggleExpand(index)}
              style={styles.passengerHeader}
              activeOpacity={0.8}
            >
              <View style={styles.passengerIcon}>
                <Ionicons name="person" size={20} color="#2C5364" />
              </View>
              <Text style={styles.passengerTitle}>
                {passenger.fullName || `Passenger ${index + 1}`}
              </Text>
              <Ionicons
                name={passenger.expanded ? "chevron-up" : "chevron-down"}
                size={20}
                color="#4FD3DA"
              />
            </TouchableOpacity>

            {passenger.expanded && (
              <Animatable.View
                animation="fadeIn"
                duration={500}
                style={styles.passengerForm}
              >
                <View style={styles.inputContainer}>
                  <FontAwesome
                    name="user"
                    size={16}
                    color="#4FD3DA"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    value={passenger.fullName}
                    onChangeText={(text) =>
                      handlePassengerChange(index, "fullName", text)
                    }
                    style={styles.input}
                    placeholder="Full Name"
                    placeholderTextColor="#AAA"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <FontAwesome
                    name="id-card"
                    size={16}
                    color="#4FD3DA"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    value={passenger.passportNumber}
                    onChangeText={(text) =>
                      handlePassengerChange(index, "passportNumber", text)
                    }
                    style={styles.input}
                    placeholder="Passport Number"
                    placeholderTextColor="#AAA"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <FontAwesome
                    name="birthday-cake"
                    size={16}
                    color="#4FD3DA"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    value={passenger.age}
                    onChangeText={(text) =>
                      handlePassengerChange(index, "age", text)
                    }
                    style={styles.input}
                    placeholder="Age"
                    placeholderTextColor="#AAA"
                    keyboardType="numeric"
                  />
                </View>

                {passengers.length > 1 && (
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => {
                      setPassengerToRemove(index);
                      setModalVisible(true);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.removeButtonText}>
                      Remove Passenger
                    </Text>
                  </TouchableOpacity>
                )}
              </Animatable.View>
            )}
          </Animatable.View>
        ))}

        <Animatable.View
          animation="fadeInUp"
          duration={800}
          delay={400 + passengers.length * 100}
        >
          <TouchableOpacity
            style={styles.addPassengerButton}
            onPress={addPassenger}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={24} color="#4FD3DA" />
            <Text style={styles.addPassengerText}>Add Passenger</Text>
          </TouchableOpacity>
        </Animatable.View>
      </ScrollView>

      {/* Footer */}
      <Animatable.View
        animation="fadeInUp"
        duration={800}
        delay={500 + passengers.length * 100}
        style={styles.footer}
      >
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={styles.totalPrice}>
            ${calculateTotalPrice().toFixed(2)}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.paymentButton}
          onPress={handleMakePayment}
          activeOpacity={0.8}
        >
          <Text style={styles.paymentButtonText}>Continue to Payment</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFF" />
        </TouchableOpacity>
      </Animatable.View>

      {/* Remove Passenger Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Animatable.View
            animation="fadeInUp"
            duration={300}
            style={styles.modalContent}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Remove Passenger</Text>
            </View>
            <Text style={styles.modalText}>
              Are you sure you want to remove this passenger from your booking?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setModalVisible(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirm}
                onPress={() => confirmRemovePassenger(passengerToRemove)}
                activeOpacity={0.7}
              >
                <Text style={styles.modalConfirmText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </Animatable.View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 25,
    paddingTop: 50,
    paddingBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  backButton: {
    marginRight: 15,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
  content: {
    padding: 20,
    paddingBottom: 120,
  },
  flightInfoCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  flightHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  flightTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2C5364",
  },
  flightPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4FD3DA",
  },
  flightDetails: {
    marginTop: 10,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 15,
    color: "#6B7280",
    marginLeft: 8,
    marginRight: 12,
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2C5364",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 20,
    marginLeft: 5,
  },
  passengerCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    marginBottom: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  passengerHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  passengerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  passengerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#2C5364",
  },
  passengerForm: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#333",
  },
  removeButton: {
    alignSelf: "flex-end",
    padding: 8,
  },
  removeButtonText: {
    color: "#EF4444",
    fontSize: 14,
    fontWeight: "500",
  },
  addPassengerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#4FD3DA",
    borderStyle: "dashed",
    marginTop: 10,
  },
  addPassengerText: {
    color: "#4FD3DA",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFF",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  totalText: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2C5364",
  },
  paymentButton: {
    backgroundColor: "#4FD3DA",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#4FD3DA",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  paymentButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
    marginRight: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: width - 40,
    backgroundColor: "#FFF",
    borderRadius: 16,
    overflow: "hidden",
  },
  modalHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2C5364",
    textAlign: "center",
  },
  modalText: {
    padding: 20,
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
  },
  modalActions: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  modalCancel: {
    flex: 1,
    padding: 16,
    borderRightWidth: 1,
    borderRightColor: "#E5E7EB",
  },
  modalCancelText: {
    textAlign: "center",
    color: "#4FD3DA",
    fontWeight: "600",
  },
  modalConfirm: {
    flex: 1,
    padding: 16,
  },
  modalConfirmText: {
    textAlign: "center",
    color: "#EF4444",
    fontWeight: "600",
  },
});

export default BookingScreen;
