import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";

export default function PaymentConfirmation() {
  const navigation = useNavigation();

  const handleHomePress = () => {
    // Navigate to home or any other page after confirmation
    navigation.navigate("Home");
  };

  return (
    <LinearGradient colors={["#16697A", "#489FB5"]} style={styles.container}>
      <View style={styles.contentContainer}>
        {/* Icon and Confirmation Text */}
        <View style={styles.iconContainer}>
          <AntDesign name="checkcircle" size={80} color="#EDE7E3" />
        </View>

        <Text style={styles.title}>Booking Confirmed!</Text>
        <Text style={styles.subTitle}>Your flight booking is complete.</Text>

        {/* Flight Information */}
        <View style={styles.flightInfoContainer}>
          <Text style={styles.flightInfoText}>
            <Text style={styles.bold}>Flight Number:</Text> AA101
          </Text>
          <Text style={styles.flightInfoText}>
            <Text style={styles.bold}>From:</Text> New York (JFK)
          </Text>
          <Text style={styles.flightInfoText}>
            <Text style={styles.bold}>To:</Text> London (LHR)
          </Text>
          <Text style={styles.flightInfoText}>
            <Text style={styles.bold}>Departure:</Text> June 1, 2025, 10:00 AM
          </Text>
        </View>

        {/* Payment Method */}
        <View style={styles.paymentInfoContainer}>
          <Text style={styles.paymentTitle}>Payment Method:</Text>
          <Text style={styles.paymentInfo}>Visa® (1234)</Text>
        </View>

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
    maxWidth: 400,
    padding: 20,
    backgroundColor: "#EDE7E3",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    alignItems: "center",
  },
  iconContainer: {
    backgroundColor: "#16697A",
    padding: 20,
    borderRadius: 50,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#16697A",
    textAlign: "center",
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 18,
    color: "#16697A",
    textAlign: "center",
    marginBottom: 20,
  },
  flightInfoContainer: {
    marginBottom: 20,
    alignItems: "flex-start",
  },
  flightInfoText: {
    fontSize: 16,
    color: "#16697A",
    marginBottom: 5,
  },
  bold: {
    fontWeight: "bold",
  },
  paymentInfoContainer: {
    marginBottom: 20,
    alignItems: "flex-start",
  },
  paymentTitle: {
    fontSize: 18,
    color: "#16697A",
    fontWeight: "bold",
    marginBottom: 5,
  },
  paymentInfo: {
    fontSize: 16,
    color: "#16697A",
  },
  button: {
    backgroundColor: "#489FB5",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
