import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import api from "../api";
import {
  Ionicons,
  MaterialIcons,
  FontAwesome,
  MaterialCommunityIcons,
} from "react-native-vector-icons";
import * as Animatable from "react-native-animatable";

export default function ViewBookingScreen() {
  const navigation = useNavigation();

  const [passengerName, setPassengerName] = useState("");
  const [bookingReference, setBookingReference] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [error, setError] = useState("");
  const [focusedInput, setFocusedInput] = useState(null);

  const handleGetBooking = async () => {
    if (!passengerName.trim() || !bookingReference.trim()) {
      setError("Please fill in all fields");
      return;
    }

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
      setError("Booking not found. Please check your details.");
    }
    setLoading(false);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <LinearGradient
      colors={["#0F2027", "#203A43", "#2C5364"]}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Animated Header */}
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
            <Ionicons name="arrow-back" size={28} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Your Booking</Text>
            <Text style={styles.subtitle}>
              Enter your details to view booking information
            </Text>
          </View>
        </Animatable.View>

        {/* Search Form */}
        <Animatable.View
          animation="fadeInUp"
          duration={800}
          delay={200}
          style={styles.formContainer}
        >
          <Text style={styles.formTitle}>Find Your Booking</Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="person-outline"
              size={20}
              color={focusedInput === "name" ? "#4FD3DA" : "#AAA"}
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Passenger Name"
              placeholderTextColor="#AAA"
              style={[
                styles.input,
                focusedInput === "name" && styles.inputFocused,
              ]}
              value={passengerName}
              onChangeText={setPassengerName}
              onFocus={() => setFocusedInput("name")}
              onBlur={() => setFocusedInput(null)}
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons
              name="confirmation-number"
              size={20}
              color={focusedInput === "reference" ? "#4FD3DA" : "#AAA"}
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Booking Reference"
              placeholderTextColor="#AAA"
              style={[
                styles.input,
                focusedInput === "reference" && styles.inputFocused,
              ]}
              value={bookingReference}
              onChangeText={setBookingReference}
              onFocus={() => setFocusedInput("reference")}
              onBlur={() => setFocusedInput(null)}
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleGetBooking}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>Retrieve Booking</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFF" />
              </View>
            )}
          </TouchableOpacity>

          {error ? (
            <Animatable.View animation="shake" duration={500}>
              <Text style={styles.errorText}>{error}</Text>
            </Animatable.View>
          ) : null}
        </Animatable.View>

        {/* Booking Data */}
        {bookingData && (
          <Animatable.View
            animation="fadeIn"
            duration={1000}
            style={styles.bookingContainer}
          >
            {/* Booking Summary Card */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <Text style={styles.summaryTitle}>Booking Summary</Text>
                <View
                  style={[
                    styles.statusBadge,
                    bookingData.status === "confirmed"
                      ? styles.statusConfirmed
                      : bookingData.status === "cancelled"
                      ? styles.statusCancelled
                      : styles.statusPending,
                  ]}
                >
                  <Text style={styles.statusText}>
                    {bookingData.status.toUpperCase()}
                  </Text>
                </View>
              </View>

              <View style={styles.summaryRow}>
                <MaterialIcons
                  name="confirmation-number"
                  size={18}
                  color="#4FD3DA"
                />
                <Text style={styles.summaryText}>
                  Ref: {bookingData.booking_reference}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <FontAwesome name="money" size={16} color="#4FD3DA" />
                <Text style={styles.summaryText}>
                  Total: ${bookingData.total_price}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <MaterialCommunityIcons
                  name="calendar-clock"
                  size={18}
                  color="#4FD3DA"
                />
                <Text style={styles.summaryText}>
                  Booked: {new Date(bookingData.booked_at).toLocaleDateString()}
                </Text>
              </View>
            </View>

            {/* Flight Details Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="airplane" size={22} color="#2C5364" />
                <Text style={styles.sectionTitle}>Flight Details</Text>
              </View>

              <View style={styles.flightRoute}>
                <View style={styles.airport}>
                  <Text style={styles.airportCode}>
                    {bookingData.flight.origin.code}
                  </Text>
                  <Text style={styles.airportCity}>
                    {bookingData.flight.origin.city}
                  </Text>
                </View>

                <View style={styles.flightTimeline}>
                  <View style={styles.flightLine} />
                  <MaterialIcons
                    name="flight"
                    size={24}
                    color="#4FD3DA"
                    style={styles.flightIcon}
                  />
                  <View style={styles.flightLine} />
                </View>

                <View style={styles.airport}>
                  <Text style={styles.airportCode}>
                    {bookingData.flight.destination.code}
                  </Text>
                  <Text style={styles.airportCity}>
                    {bookingData.flight.destination.city}
                  </Text>
                </View>
              </View>

              <View style={styles.flightDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Flight Number:</Text>
                  <Text style={styles.detailValue}>
                    {bookingData.flight.flight_number}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Airline:</Text>
                  <Text style={styles.detailValue}>
                    {bookingData.flight.airline.name}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Departure:</Text>
                  <Text style={styles.detailValue}>
                    {new Date(
                      bookingData.flight.departure_time
                    ).toLocaleString()}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Arrival:</Text>
                  <Text style={styles.detailValue}>
                    {new Date(bookingData.flight.arrival_time).toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>

            {/* Payment Details Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <FontAwesome name="credit-card" size={20} color="#2C5364" />
                <Text style={styles.sectionTitle}>Payment Information</Text>
              </View>

              <View style={styles.paymentCard}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Method:</Text>
                  <Text style={styles.detailValue}>
                    {bookingData.payment.method}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Status:</Text>
                  <Text
                    style={[
                      styles.detailValue,
                      bookingData.payment.status === "completed"
                        ? styles.paymentCompleted
                        : bookingData.payment.status === "failed"
                        ? styles.paymentFailed
                        : styles.paymentPending,
                    ]}
                  >
                    {bookingData.payment.status}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Processed:</Text>
                  <Text style={styles.detailValue}>
                    {new Date(bookingData.payment.paid_at).toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.actionButton}
              activeOpacity={0.7}
              onPress={() => navigation.navigate("Home")}
            >
              <Text style={styles.actionButtonText}>Back to Home</Text>
            </TouchableOpacity>
          </Animatable.View>
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
    paddingBottom: 40,
  },
  header: {
    padding: 25,
    paddingTop: 50,
    paddingBottom: 20,
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
  formContainer: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2C5364",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#F5F7FA",
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
  inputFocused: {
    borderColor: "#4FD3DA",
  },
  button: {
    backgroundColor: "#4FD3DA",
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
    shadowColor: "#4FD3DA",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
    marginRight: 10,
  },
  errorText: {
    color: "#FF6B6B",
    marginTop: 15,
    textAlign: "center",
    fontSize: 14,
  },
  bookingContainer: {
    backgroundColor: "#FFF",
    padding: 25,
    marginTop: -20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  summaryCard: {
    backgroundColor: "#F5F7FA",
    borderRadius: 16,
    padding: 20,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E1E5EB",
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2C5364",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusConfirmed: {
    backgroundColor: "#D1FAE5",
  },
  statusCancelled: {
    backgroundColor: "#FEE2E2",
  },
  statusPending: {
    backgroundColor: "#FEF3C7",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#065F46",
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 15,
    color: "#4B5563",
    marginLeft: 10,
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2C5364",
    marginLeft: 8,
  },
  flightRoute: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  airport: {
    alignItems: "center",
    flex: 1,
  },
  airportCode: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2C5364",
    marginBottom: 5,
  },
  airportCity: {
    fontSize: 14,
    color: "#6B7280",
  },
  flightTimeline: {
    alignItems: "center",
    width: 100,
  },
  flightLine: {
    height: 1,
    width: "80%",
    backgroundColor: "#D1D5DB",
  },
  flightIcon: {
    marginVertical: 5,
    transform: [{ rotate: "90deg" }],
  },
  flightDetails: {
    backgroundColor: "#F5F7FA",
    borderRadius: 12,
    padding: 15,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2C5364",
  },
  paymentCard: {
    backgroundColor: "#F5F7FA",
    borderRadius: 12,
    padding: 15,
  },
  paymentCompleted: {
    color: "#10B981",
  },
  paymentFailed: {
    color: "#EF4444",
  },
  paymentPending: {
    color: "#F59E0B",
  },
  actionButton: {
    backgroundColor: "#2C5364",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
  },
  actionButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
