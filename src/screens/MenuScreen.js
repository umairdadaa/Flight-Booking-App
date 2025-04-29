import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "react-native-vector-icons";

export default function MenuScreen() {
  const navigation = useNavigation();

  const handleCancelFlight = () => {
    navigation.navigate("CancelBookingScreen");
  };

  const handleCheckIn = () => {
    navigation.navigate("CheckInScreen");
  };

  const handleViewBooking = () => {
    navigation.navigate("ViewBookingScreen");
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, // Hide the default header
    });
  }, [navigation]);

  return (
    <LinearGradient colors={["#16697A", "#489FB5"]} style={styles.container}>
      {/* Back Button and Menu Heading */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#EDE7E3" />
        </TouchableOpacity>
        <Text style={styles.title}>Menu</Text>
      </View>

      {/* Menu options */}
      <View style={styles.menuContainer}>
        <Text style={styles.subtitle}>Choose Your Next Step</Text>

        {/* Cancel Flight Button */}
        <TouchableOpacity style={styles.button} onPress={handleCancelFlight}>
          <Text style={styles.buttonText}>Cancel your Flight</Text>
        </TouchableOpacity>

        {/* Check In Online Button */}
        <TouchableOpacity style={styles.button} onPress={handleCheckIn}>
          <Text style={styles.buttonText}>Check In Online</Text>
        </TouchableOpacity>

        {/* View Booking Button */}
        <TouchableOpacity style={styles.button} onPress={handleViewBooking}>
          <Text style={styles.buttonText}>View Booking</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#16697A",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
    width: "100%",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
  },
  backButton: {
    // backgroundColor: "#EDE7E3",
    padding: 12,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 28,
    color: "#EDE7E3",
  },
  title: {
    fontSize: 30,
    fontWeight: "600",
    color: "#EDE7E3",
    marginLeft: 20,
  },
  menuContainer: {
    marginTop: 40,
    width: "100%",
    alignItems: "center",
    paddingVertical: 30,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "500",
    color: "#EDE7E3",
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#489FB5",
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginBottom: 20,
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },
});
