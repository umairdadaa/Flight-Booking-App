import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "react-native-vector-icons";
import VisaLogo from "./assets/visa.png"; // Add your Visa logo image in assets
import MasterCardLogo from "./assets/mastercard.png"; // Add your MasterCard logo image in assets
import AmexLogo from "./assets/amex.png"; // Add your Amex logo image in assets
import DiscoverLogo from "./assets/discover.png"; // Add your Discover logo image in assets

export default function PaymentPage({ route, navigation }) {
  const { selectedFlight } = route.params;
  const [paymentMethod, setPaymentMethod] = useState("creditCard");
  const [creditCardInfo, setCreditCardInfo] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [paypalInfo, setPaypalInfo] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [opacity] = useState(new Animated.Value(0));

  // Detecting card type from card number
  const getCardLogo = (cardNumber) => {
    if (cardNumber.startsWith("4")) {
      return VisaLogo;
    } else if (cardNumber.startsWith("5") || cardNumber.startsWith("2")) {
      return MasterCardLogo;
    } else if (cardNumber.startsWith("34") || cardNumber.startsWith("37")) {
      return AmexLogo;
    } else if (cardNumber.startsWith("6")) {
      return DiscoverLogo;
    } else {
      return null;
    }
  };

  const handlePayment = () => {
    setIsLoading(true);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Simulating payment processing
    setTimeout(() => {
      setIsLoading(false);
      setPaymentSuccess(true);
    }, 3000);
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setCreditCardInfo({
      cardName: "",
      cardNumber: "",
      expiry: "",
      cvv: "",
    });
    setPaypalInfo({
      email: "",
      password: "",
    });
    setPaymentSuccess(false);
  };

  return (
    <LinearGradient colors={["#16697A", "#489FB5"]} style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#EDE7E3" />
        </TouchableOpacity>
        <Text style={styles.heading}>Payment</Text>
      </View>

      {/* Payment Form */}
      <View style={styles.paymentForm}>
        <Text style={styles.paymentFormTitle}>Enter Payment Information</Text>

        {/* Choose Payment Method */}
        <View style={styles.paymentMethodContainer}>
          <TouchableOpacity
            style={[
              styles.paymentMethodButton,
              paymentMethod === "creditCard" && styles.selectedButton,
            ]}
            onPress={() => handlePaymentMethodChange("creditCard")}
          >
            <Text style={styles.paymentMethodButtonText}>Credit Card</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.paymentMethodButton,
              paymentMethod === "paypal" && styles.selectedButton,
            ]}
            onPress={() => handlePaymentMethodChange("paypal")}
          >
            <Text style={styles.paymentMethodButtonText}>PayPal</Text>
          </TouchableOpacity>
        </View>

        {/* PayPal Form */}
        {paymentMethod === "paypal" && (
          <>
            <TextInput
              style={styles.input}
              placeholder="PayPal Email"
              value={paypalInfo.email}
              onChangeText={(text) =>
                setPaypalInfo({ ...paypalInfo, email: text })
              }
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="PayPal Password"
              value={paypalInfo.password}
              onChangeText={(text) =>
                setPaypalInfo({ ...paypalInfo, password: text })
              }
              secureTextEntry
            />
          </>
        )}

        {/* Credit Card Form */}
        {paymentMethod === "creditCard" && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Name on Card"
              value={creditCardInfo.cardName}
              onChangeText={(text) =>
                setCreditCardInfo({ ...creditCardInfo, cardName: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Card Number"
              value={creditCardInfo.cardNumber}
              onChangeText={(text) =>
                setCreditCardInfo({ ...creditCardInfo, cardNumber: text })
              }
              keyboardType="numeric"
            />

            {/* Card Type Logo */}
            {creditCardInfo.cardNumber && (
              <View style={styles.cardLogoContainer}>
                <Image
                  source={getCardLogo(creditCardInfo.cardNumber)}
                  style={styles.cardLogo}
                />
              </View>
            )}

            <TextInput
              style={styles.input}
              placeholder="Expiry (MM/YY)"
              value={creditCardInfo.expiry}
              onChangeText={(text) =>
                setCreditCardInfo({ ...creditCardInfo, expiry: text })
              }
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="CVV"
              value={creditCardInfo.cvv}
              onChangeText={(text) =>
                setCreditCardInfo({ ...creditCardInfo, cvv: text })
              }
              keyboardType="numeric"
            />
          </>
        )}

        {/* Payment Button */}
        <Button title="Pay Now" onPress={handlePayment} color="#FFA62B" />

        {/* Loading Animation */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Processing Payment...</Text>
            <Animated.View style={{ opacity }}>
              <Ionicons name="ios-refresh" size={40} color="#EDE7E3" />
            </Animated.View>
          </View>
        )}

        {/* Confirmation Message */}
        {paymentSuccess && (
          <View style={styles.confirmationContainer}>
            <Text style={styles.confirmationText}>
              Your booking is now confirmed!
            </Text>
            <Button
              title="Back to Home"
              onPress={() => navigation.navigate("Home")}
            />
          </View>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
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
  paymentForm: {
    marginTop: 30,
    width: "100%",
    paddingHorizontal: 20,
    backgroundColor: "#EDE7E3",
    borderRadius: 10,
    padding: 20,
  },
  paymentFormTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#16697A",
    marginBottom: 15,
  },
  paymentMethodContainer: {
    flexDirection: "row",
    marginBottom: 15,
    justifyContent: "space-around",
  },
  paymentMethodButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#EDE7E3",
    width: "45%",
    alignItems: "center",
  },
  selectedButton: {
    backgroundColor: "#489FB5",
  },
  paymentMethodButtonText: {
    fontSize: 16,
    color: "#16697A",
  },
  input: {
    height: 40,
    borderColor: "#16697A",
    borderWidth: 1,
    marginBottom: 15,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  cardLogoContainer: {
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  cardLogo: {
    width: 50,
    height: 30,
    resizeMode: "contain",
  },
  loadingContainer: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#FFA62B",
    marginBottom: 10,
  },
  confirmationContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  confirmationText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#489FB5",
    marginBottom: 20,
  },
});
