import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import api from "../api";

export default function CheckInScreen() {
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

  const handleCheckIn = async () => {
    try {
      setLoading(true);
      setError("");
      setResult(null);

      const response = await api.post("/bookings/checkIn", {
        name,
        bookingReference,
        age: parseInt(age),
        passportNumber,
      });

      setResult(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#EDE7E3" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Online Check IN</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Passenger Name"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#aaa"
        />
        <TextInput
          style={styles.input}
          placeholder="Booking Reference"
          value={bookingReference}
          onChangeText={setBookingReference}
          placeholderTextColor="#aaa"
        />
        <TextInput
          style={styles.input}
          placeholder="Age"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
          placeholderTextColor="#aaa"
        />
        <TextInput
          style={styles.input}
          placeholder="Passport Number"
          value={passportNumber}
          onChangeText={setPassportNumber}
          placeholderTextColor="#aaa"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleCheckIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Check In Now</Text>
          )}
        </TouchableOpacity>

        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>

      {/* Result */}
      {result && (
        <View style={styles.resultContainer}>
          <Text style={styles.success}>{result.message}</Text>
          <Text style={styles.resultText}>
            Booking Reference: {result.booking.booking_reference}
          </Text>
          <Text style={styles.resultText}>Status: {result.booking.status}</Text>
          <Text style={styles.resultText}>
            You will be assigned your seat at the check-in area. Please proceed
            to the online check-in counters if you have luggage or use the
            kiosk.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#16697A",
    padding: 20,
    paddingTop: 100,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  topBarTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#EDE7E3",
    marginLeft: 12,
  },
  form: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#FFA62B",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  resultContainer: {
    marginTop: 30,
    backgroundColor: "#EDE7E3",
    padding: 20,
    borderRadius: 10,
  },
  success: {
    fontSize: 18,
    fontWeight: "bold",
    color: "green",
    marginBottom: 10,
    textAlign: "center",
  },
  resultText: {
    fontSize: 16,
    marginBottom: 6,
    color: "#333",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
});
