import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

export default function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState("creditCard");
  const [cardDetails, setCardDetails] = useState({
    name: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [paypalDetails, setPaypalDetails] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSubmit = () => {
    setLoading(true);
    // Simulate API call with a timeout
    setTimeout(() => {
      setLoading(false);
      navigation.navigate("PaymentConfirmation");
    }, 3000); // Simulate loading for 3 seconds
  };

  const renderCreditCardForm = () => (
    <View style={styles.form}>
      <Text style={styles.label}>Name on Card</Text>
      <TextInput
        style={styles.input}
        value={cardDetails.name}
        onChangeText={(text) => setCardDetails({ ...cardDetails, name: text })}
        placeholder="John Doe"
      />
      <Text style={styles.label}>Card Number</Text>
      <TextInput
        style={styles.input}
        value={cardDetails.cardNumber}
        onChangeText={(text) =>
          setCardDetails({ ...cardDetails, cardNumber: text })
        }
        placeholder="1234 5678 1234 5678"
        keyboardType="numeric"
      />
      <View style={styles.row}>
        <View style={styles.halfInput}>
          <Text style={styles.label}>Expiry</Text>
          <TextInput
            style={styles.input}
            value={cardDetails.expiry}
            onChangeText={(text) =>
              setCardDetails({ ...cardDetails, expiry: text })
            }
            placeholder="MM/YY"
            keyboardType="numeric"
          />
        </View>
        <View style={styles.halfInput}>
          <Text style={styles.label}>CVV</Text>
          <TextInput
            style={styles.input}
            value={cardDetails.cvv}
            onChangeText={(text) =>
              setCardDetails({ ...cardDetails, cvv: text })
            }
            placeholder="123"
            keyboardType="numeric"
            secureTextEntry
          />
        </View>
      </View>
      <Text style={styles.cardInfo}>
        {`Card Type: ${
          cardDetails.cardNumber.startsWith("4")
            ? "Visa®"
            : cardDetails.cardNumber.startsWith("5") ||
              cardDetails.cardNumber.startsWith("2")
            ? "Mastercard®"
            : cardDetails.cardNumber.startsWith("34") ||
              cardDetails.cardNumber.startsWith("37")
            ? "American Express®"
            : cardDetails.cardNumber.startsWith("6")
            ? "Discover®"
            : "Unknown"
        }`}
      </Text>
    </View>
  );

  const renderPaypalForm = () => (
    <View style={styles.form}>
      <Text style={styles.label}>PayPal Email</Text>
      <TextInput
        style={styles.input}
        value={paypalDetails.email}
        onChangeText={(text) =>
          setPaypalDetails({ ...paypalDetails, email: text })
        }
        placeholder="email@example.com"
      />
      <Text style={styles.label}>PayPal Password</Text>
      <TextInput
        style={styles.input}
        value={paypalDetails.password}
        onChangeText={(text) =>
          setPaypalDetails({ ...paypalDetails, password: text })
        }
        placeholder="••••••••"
        secureTextEntry
      />
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
  cardInfo: {
    fontSize: 14,
    color: "#16697A",
    marginTop: 10,
    fontStyle: "italic",
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
