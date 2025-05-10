import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import api from "../api";
import * as Animatable from "react-native-animatable";

export default function CancelBookingScreen() {
  const navigation = useNavigation();
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const [name, setName] = useState("");
  const [bookingReference, setBookingReference] = useState("");
  const [age, setAge] = useState("");
  const [passportNumber, setPassportNumber] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const handleCancelBooking = async () => {
    if (
      !name.trim() ||
      !bookingReference.trim() ||
      !age.trim() ||
      !passportNumber.trim()
    ) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const response = await api.post("/bookings/cancel", {
        name,
        bookingReference,
        age: parseInt(age),
        passportNumber,
      });

      setResult(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to cancel booking. Please check your details."
      );
    } finally {
      setLoading(false);
    }
  };

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
            <Text style={styles.title}>Cancel Booking</Text>
            <Text style={styles.subtitle}>
              Enter your details to cancel your booking
            </Text>
          </View>
        </Animatable.View>

        {/* Form */}
        <Animatable.View
          animation="fadeInUp"
          duration={800}
          delay={200}
          style={styles.formContainer}
        >
          <Text style={styles.formTitle}>Booking Details</Text>

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
              value={name}
              onChangeText={setName}
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

          <View style={styles.inputContainer}>
            <FontAwesome
              name="birthday-cake"
              size={18}
              color={focusedInput === "age" ? "#4FD3DA" : "#AAA"}
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Age"
              placeholderTextColor="#AAA"
              style={[
                styles.input,
                focusedInput === "age" && styles.inputFocused,
              ]}
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
              onFocus={() => setFocusedInput("age")}
              onBlur={() => setFocusedInput(null)}
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons
              name="contact-page"
              size={20}
              color={focusedInput === "passport" ? "#4FD3DA" : "#AAA"}
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Passport Number"
              placeholderTextColor="#AAA"
              style={[
                styles.input,
                focusedInput === "passport" && styles.inputFocused,
              ]}
              value={passportNumber}
              onChangeText={setPassportNumber}
              onFocus={() => setFocusedInput("passport")}
              onBlur={() => setFocusedInput(null)}
            />
          </View>

          {error ? (
            <Animatable.View animation="shake" duration={500}>
              <Text style={styles.errorText}>{error}</Text>
            </Animatable.View>
          ) : null}

          <TouchableOpacity
            style={styles.button}
            onPress={handleCancelBooking}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>Cancel Booking</Text>
                <Ionicons name="close-circle-outline" size={22} color="#FFF" />
              </View>
            )}
          </TouchableOpacity>
        </Animatable.View>

        {/* Result */}
        {result && (
          <Animatable.View
            animation="fadeIn"
            duration={1000}
            style={styles.resultContainer}
          >
            <View style={styles.successCard}>
              <View style={styles.successHeader}>
                <Ionicons
                  name="checkmark-done-circle"
                  size={28}
                  color="#10B981"
                />
                <Text style={styles.successTitle}>Booking Cancelled</Text>
              </View>

              <Text style={styles.successMessage}>{result.message}</Text>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Reference:</Text>
                <Text style={styles.detailValue}>
                  {result.booking.booking_reference}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Status:</Text>
                <Text style={[styles.detailValue, styles.statusCancelled]}>
                  {result.booking.status.toUpperCase()}
                </Text>
              </View>

              <View style={styles.refundInfo}>
                <Ionicons name="information-circle" size={20} color="#4FD3DA" />
                <Text style={styles.refundText}>
                  Your payment will be refunded within 14 business days
                  (according to our Terms & Conditions)
                </Text>
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
    backgroundColor: "#FF6B6B",
    borderRadius: 12,
    padding: 16,
    marginTop: 15,
    shadowColor: "#FF6B6B",
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
    marginTop: 10,
    textAlign: "center",
    fontSize: 14,
  },
  resultContainer: {
    backgroundColor: "#FFF",
    padding: 25,
    marginTop: -20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  successCard: {
    backgroundColor: "#F5F7FA",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  successHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#10B981",
    marginLeft: 10,
  },
  successMessage: {
    fontSize: 16,
    color: "#2C5364",
    marginBottom: 20,
    lineHeight: 24,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 15,
    color: "#6B7280",
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2C5364",
  },
  statusCancelled: {
    color: "#EF4444",
  },
  refundInfo: {
    flexDirection: "row",
    backgroundColor: "#EFF6FF",
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
  },
  refundText: {
    flex: 1,
    fontSize: 14,
    color: "#3B82F6",
    marginLeft: 10,
    lineHeight: 20,
  },
  actionButton: {
    backgroundColor: "#2C5364",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
