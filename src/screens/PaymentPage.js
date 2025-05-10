import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Image,
  Dimensions,
  Animated,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import LottieView from "lottie-react-native";
import api from "../api";

const { width } = Dimensions.get("window");

const PaymentPage = ({ route, navigation }) => {
  const { bookingData, full_name } = route.params;
  const [paymentMethod, setPaymentMethod] = useState("creditCard");
  const [loading, setLoading] = useState(false);
  const [nameOnCard, setNameOnCard] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const handleSubmit = async () => {
    setLoading(true);
    const updatedBookingData = { ...bookingData, paymentMethod };

    try {
      const response = await api.post("/flights/book", updatedBookingData);
      const { bookingReference } = response.data;

      navigation.navigate("PaymentConfirmation", {
        fullName: full_name,
        bookingReference,
      });
    } catch (error) {
      console.error("Payment API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (number) => {
    return number
      .replace(/\D/g, "")
      .replace(/(\d{4})/g, "$1 ")
      .trim();
  };

  const formatExpiry = (text) => {
    const cleaned = text.replace(/\D/g, "");
    if (cleaned.length >= 3) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const renderCreditCard = () => (
    <Animatable.View
      animation="fadeInUp"
      duration={800}
      delay={200}
      style={styles.cardContainer}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => setIsCardFlipped(!isCardFlipped)}
        style={styles.cardWrapper}
      >
        <LinearGradient
          colors={["#2C5364", "#203A43"]}
          style={styles.card}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {!isCardFlipped ? (
            <View style={styles.cardFront}>
              <View style={styles.cardHeader}>
                <MaterialIcons name="credit-card" size={24} color="#4FD3DA" />
                <Text style={styles.cardTitle}>Credit Card</Text>
              </View>

              <View style={styles.cardNumberContainer}>
                <Text style={styles.cardNumber}>
                  {cardNumber
                    ? formatCardNumber(cardNumber)
                    : "•••• •••• •••• ••••"}
                </Text>
              </View>

              <View style={styles.cardFooter}>
                <View>
                  <Text style={styles.cardLabel}>Card Holder</Text>
                  <Text style={styles.cardText}>
                    {nameOnCard || "YOUR NAME"}
                  </Text>
                </View>
                <View>
                  <Text style={styles.cardLabel}>Expires</Text>
                  <Text style={styles.cardText}>{expiry || "••/••"}</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.cardBack}>
              <View style={styles.cardMagneticStripe} />
              <View style={styles.cvvContainer}>
                <Text style={styles.cvvLabel}>CVV</Text>
                <Text style={styles.cvvText}>
                  {cvv ? "•".repeat(cvv.length) : "•••"}
                </Text>
              </View>
              <View style={styles.cardFooter}>
                <MaterialIcons
                  name="credit-card"
                  size={24}
                  color="rgba(255,255,255,0.3)"
                />
              </View>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </Animatable.View>
  );

  const renderPaymentForm = () => (
    <Animatable.View
      animation="fadeInUp"
      duration={800}
      delay={300}
      style={styles.formContainer}
    >
      <Text style={styles.sectionTitle}>Payment Details</Text>

      <View style={styles.inputContainer}>
        <FontAwesome
          name="user"
          size={16}
          color="#4FD3DA"
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Name on Card"
          placeholderTextColor="#AAA"
          value={nameOnCard}
          onChangeText={setNameOnCard}
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons
          name="credit-card"
          size={16}
          color="#4FD3DA"
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Card Number"
          placeholderTextColor="#AAA"
          keyboardType="numeric"
          value={cardNumber}
          maxLength={19}
          onChangeText={(text) => setCardNumber(text.replace(/\D/g, ""))}
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
          <MaterialIcons
            name="date-range"
            size={16}
            color="#4FD3DA"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="MM/YY"
            placeholderTextColor="#AAA"
            keyboardType="numeric"
            value={expiry}
            maxLength={5}
            onChangeText={(text) => setExpiry(formatExpiry(text))}
          />
        </View>

        <View style={[styles.inputContainer, { flex: 1 }]}>
          <FontAwesome
            name="lock"
            size={16}
            color="#4FD3DA"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="CVV"
            placeholderTextColor="#AAA"
            keyboardType="numeric"
            secureTextEntry
            maxLength={4}
            value={cvv}
            onFocus={() => setIsCardFlipped(true)}
            onBlur={() => setIsCardFlipped(false)}
            onChangeText={(text) => setCvv(text.replace(/\D/g, ""))}
          />
        </View>
      </View>
    </Animatable.View>
  );

  const renderPaymentMethods = () => (
    <Animatable.View
      animation="fadeInUp"
      duration={800}
      delay={100}
      style={styles.methodsContainer}
    >
      <TouchableOpacity
        style={[
          styles.methodButton,
          paymentMethod === "creditCard" && styles.activeMethod,
        ]}
        onPress={() => setPaymentMethod("creditCard")}
        activeOpacity={0.8}
      >
        <View style={styles.methodContent}>
          <MaterialIcons
            name="credit-card"
            size={24}
            color={paymentMethod === "creditCard" ? "#FFF" : "#4FD3DA"}
          />
          <Text
            style={[
              styles.methodText,
              paymentMethod === "creditCard" && styles.activeMethodText,
            ]}
          >
            Credit Card
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.methodButton,
          paymentMethod === "paypal" && styles.activeMethod,
        ]}
        onPress={() => setPaymentMethod("paypal")}
        activeOpacity={0.8}
      >
        <View style={styles.methodContent}>
          <FontAwesome
            name="paypal"
            size={24}
            color={paymentMethod === "paypal" ? "#FFF" : "#4FD3DA"}
          />
          <Text
            style={[
              styles.methodText,
              paymentMethod === "paypal" && styles.activeMethodText,
            ]}
          >
            PayPal
          </Text>
        </View>
      </TouchableOpacity>
    </Animatable.View>
  );

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
          <Ionicons name="arrow-back" size={28} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Complete Payment</Text>
          <Text style={styles.subtitle}>Secure payment processing</Text>
        </View>
      </Animatable.View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {renderPaymentMethods()}
          {paymentMethod === "creditCard" && renderCreditCard()}
          {paymentMethod === "creditCard" && renderPaymentForm()}

          {paymentMethod === "paypal" && (
            <Animatable.View
              animation="fadeInUp"
              duration={800}
              delay={300}
              style={styles.paypalContainer}
            >
              <Text style={styles.sectionTitle}>PayPal Login</Text>
              <View style={styles.inputContainer}>
                <MaterialIcons
                  name="email"
                  size={16}
                  color="#4FD3DA"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="PayPal Email"
                  placeholderTextColor="#AAA"
                  keyboardType="email-address"
                />
              </View>
              <View style={styles.inputContainer}>
                <MaterialIcons
                  name="lock"
                  size={16}
                  color="#4FD3DA"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#AAA"
                  secureTextEntry
                />
              </View>
            </Animatable.View>
          )}
        </ScrollView>

        {/* Payment Button */}
        <Animatable.View
          animation="fadeInUp"
          duration={800}
          delay={400}
          style={styles.paymentButtonContainer}
        >
          <TouchableOpacity
            style={styles.paymentButton}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Text style={styles.paymentButtonText}>
              Pay ${bookingData?.payment?.amount || "0.00"}
            </Text>
            <Ionicons name="lock-closed" size={20} color="#FFF" />
          </TouchableOpacity>
        </Animatable.View>
      </KeyboardAvoidingView>

      {/* Loading Modal */}
      <Modal transparent visible={loading}>
        <View style={styles.loadingContainer}>
          <LottieView
            source={require("../assets/lottie/loading.json")}
            autoPlay
            loop
            style={{ width: 150, height: 150 }}
          />
          <Text style={styles.loadingText}>Processing Payment...</Text>
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
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  methodsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  methodButton: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: 15,
    width: "48%",
    borderWidth: 1,
    borderColor: "rgba(79, 211, 218, 0.3)",
  },
  activeMethod: {
    backgroundColor: "#4FD3DA",
    borderColor: "#4FD3DA",
  },
  methodContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  methodText: {
    color: "#4FD3DA",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
  activeMethodText: {
    color: "#FFF",
  },
  cardContainer: {
    alignItems: "center",
    marginBottom: 25,
  },
  cardWrapper: {
    width: "100%",
    height: 200,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    justifyContent: "space-between",
  },
  cardFront: {
    flex: 1,
    justifyContent: "space-between",
  },
  cardBack: {
    flex: 1,
    justifyContent: "space-between",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
  cardNumberContainer: {
    marginVertical: 20,
  },
  cardNumber: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "600",
    letterSpacing: 2,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    marginBottom: 5,
  },
  cardText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  cardMagneticStripe: {
    height: 40,
    backgroundColor: "#000",
    borderTopWidth: 5,
    borderBottomWidth: 5,
    borderColor: "rgba(255,255,255,0.2)",
    marginTop: 20,
  },
  cvvContainer: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 10,
    borderRadius: 5,
    alignSelf: "flex-end",
    marginRight: 20,
  },
  cvvLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
  },
  cvvText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
  formContainer: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
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
  row: {
    flexDirection: "row",
  },
  paypalContainer: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  paymentButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  loadingText: {
    color: "#FFF",
    fontSize: 16,
    marginTop: 20,
  },
});

export default PaymentPage;
