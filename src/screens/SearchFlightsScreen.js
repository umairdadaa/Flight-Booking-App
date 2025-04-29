import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

const SearchFlightsScreen = ({ navigation }) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const formatDate = (date) => date.toISOString().split("T")[0];

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const validateAndNavigate = () => {
    if (!origin.trim() || !destination.trim()) {
      Alert.alert("Missing Information", "Please enter both origin and destination.");
      return;
    }

    navigation.navigate("Flights", {
      origin,
      destination,
      date: formatDate(date),
    });
  };

  return (
    <LinearGradient colors={["#16697A", "#489FB5"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.heading}>
          <Ionicons name="airplane" size={28} color="#FFA62B" />{" "}
          Search Flights
        </Text>

        <View style={styles.card}>
          <Text style={styles.label}>From</Text>
          <TextInput
            placeholder="Origin city"
            placeholderTextColor="#999"
            style={styles.input}
            value={origin}
            onChangeText={setOrigin}
          />

          <Text style={styles.label}>To</Text>
          <TextInput
            placeholder="Destination city"
            placeholderTextColor="#999"
            style={styles.input}
            value={destination}
            onChangeText={setDestination}
          />

          <Text style={styles.label}>Departure Date</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={[styles.input, { justifyContent: "center" }]}
          >
            <Text style={{ color: "#333", fontSize: 16 }}>{formatDate(date)}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onChangeDate}
            />
          )}
        </View>

        <TouchableOpacity style={styles.button} onPress={validateAndNavigate}>
          <Text style={styles.buttonText}>Search Flights</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() =>
            navigation.navigate("Flights", {
              origin: '',
              destination: '',
              date: '',
            })}
        >
          <Text style={styles.buttonText}>View All Flights</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuLink}
          onPress={() => navigation.navigate("MenuScreen")}
        >
          <Text style={styles.menuText}>Go to Menu</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    flexGrow: 1,
    justifyContent: "center",
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#EDE7E3",
    textAlign: "center",
    marginBottom: 30,
  },
  card: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    color: "#16697A",
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#F9F9F9",
    color: "#333",
  },
  button: {
    backgroundColor: "#FFA62B",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 20,
  },
  secondaryButton: {
    backgroundColor: "#FFB84D",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  menuLink: {
    alignItems: "center",
    marginTop: 20,
  },
  menuText: {
    color: "#EDE7E3",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});

export default SearchFlightsScreen;
