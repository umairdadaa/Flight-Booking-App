import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import api from "../api"; // Assuming you have an 'api' module for making API calls

export default function PaymentPage() {
  const route = useRoute();
  const { bookingData, full_name } = route.params; // Access the bookingData passed from BookingScreen
  const navigation = useNavigation();


  const [paymentMethod, setPaymentMethod] = useState(
    bookingData.paymentMethod || "creditCard"
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const updatedBookingData = {
      ...bookingData,
      paymentMethod: paymentMethod, // Update payment method based on user selection
    };

    console.log(updatedBookingData); // Log the updated bookingData

    setLoading(true);

    try {
      // Send the booking data to the backend for processing the payment
      const response = await api.post("/flights/book", updatedBookingData);

      console.log("Payment Success Response:", response.data); // Log the successful response

      // Extracting the necessary values
    //   const { full_name } = bookingData.passengers[0]; // Get full_name from the first passenger
      const { bookingReference } = response.data; // Get bookingReference from the response
        console.log(full_name);
        
      // Navigate to the PaymentConfirmation screen with only the necessary data
      navigation.navigate("PaymentConfirmation", {
        fullName: full_name,
        bookingReference: bookingReference,
      });
    } catch (error) {
      console.error("Payment API Error:", error); // Log any error from the API call
    } finally {
      setLoading(false); // Hide loading spinner once API call completes
    }
  };

  const renderCreditCardForm = () => (
    <View style={styles.form}>
      <Text style={styles.label}>Name on Card</Text>
      <TextInput style={styles.input} placeholder="John Doe" />
      <Text style={styles.label}>Card Number</Text>
      <TextInput
        style={styles.input}
        placeholder="1234 5678 1234 5678"
        keyboardType="numeric"
      />
      <View style={styles.row}>
        <View style={styles.halfInput}>
          <Text style={styles.label}>Expiry</Text>
          <TextInput
            style={styles.input}
            placeholder="MM/YY"
            keyboardType="numeric"
          />
        </View>
        <View style={styles.halfInput}>
          <Text style={styles.label}>CVV</Text>
          <TextInput
            style={styles.input}
            placeholder="123"
            keyboardType="numeric"
            secureTextEntry
          />
        </View>
      </View>
    </View>
  );

  const renderPaypalForm = () => (
    <View style={styles.form}>
      <Text style={styles.label}>PayPal Email</Text>
      <TextInput style={styles.input} placeholder="email@example.com" />
      <Text style={styles.label}>PayPal Password</Text>
      <TextInput style={styles.input} placeholder="••••••••" secureTextEntry />
    </View>
  );

  return (
    <LinearGradient colors={["#16697A", "#489FB5"]} style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.formContainer}>
          <Text style={styles.title}>Payment Information</Text>

          {/* Payment Method Switch */}
          <View style={styles.switchContainer}>
            <TouchableOpacity
              style={[
                styles.switchButton,
                paymentMethod === "creditCard" && styles.activeButton,
              ]}
              onPress={() => setPaymentMethod("creditCard")}
            >
              <Text style={styles.switchButtonText}>Credit Card</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.switchButton,
                paymentMethod === "paypal" && styles.activeButton,
              ]}
              onPress={() => setPaymentMethod("paypal")}
            >
              <Text style={styles.switchButtonText}>PayPal</Text>
            </TouchableOpacity>
          </View>

          {/* Render the corresponding form */}
          {paymentMethod === "creditCard"
            ? renderCreditCardForm()
            : renderPaypalForm()}

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Pay Now</Text>
          </TouchableOpacity>

          {/* Loading Spinner */}
          {loading && (
            <Modal transparent={true} visible={loading}>
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#EDE7E3" />
                <Text style={styles.loadingText}>Processing Payment...</Text>
              </View>
            </Modal>
          )}
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
    padding: 20,
    backgroundColor: "#EDE7E3",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#16697A",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    color: "#16697A",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    height: 45,
    paddingLeft: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#EDE7E3",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    width: "48%",
  },
  switchContainer: {
    flexDirection: "row",
    marginBottom: 20,
    justifyContent: "space-around",
  },
  switchButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#16697A",
    margin: 5,
  },
  activeButton: {
    backgroundColor: "#489FB5",
  },
  switchButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  submitButton: {
    backgroundColor: "#FFA62B",
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
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
  },
});
