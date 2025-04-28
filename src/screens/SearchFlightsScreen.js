import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "react-native-vector-icons";

const SearchFlightsScreen = ({ navigation }) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const formatDate = (date) => {
    return date.toISOString().split("T")[0]; // yyyy-mm-dd
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <LinearGradient colors={["#16697A", "#489FB5"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Back Button and Heading */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#EDE7E3" />
          </TouchableOpacity>
          <Text style={styles.title}>Find Your Next Flight</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Origin</Text>
          <TextInput
            value={origin}
            onChangeText={setOrigin}
            style={styles.input}
            placeholder="Enter origin city"
            placeholderTextColor="#EDE7E3"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Destination</Text>
          <TextInput
            value={destination}
            onChangeText={setDestination}
            style={styles.input}
            placeholder="Enter destination city"
            placeholderTextColor="#EDE7E3"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Date</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.input}
          >
            <Text style={{ color: "#EDE7E3", fontSize: 16 }}>
              {formatDate(date)}
            </Text>
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

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate("Flights", {
              origin,
              destination,
              date: formatDate(date),
            })
          }
        >
          <Text style={styles.buttonText}>Search Flights</Text>
        </TouchableOpacity>

        {/* Menu Button */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.navigate("Menu")}
        >
          <Text style={styles.buttonText}>Go to Menu</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#EDE7E3",
    flex: 1, // This will allow the heading to take up available space
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#EDE7E3",
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderColor: "#EDE7E3",
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: "center",
    paddingLeft: 15,
    fontSize: 16,
    color: "#EDE7E3",
    backgroundColor: "#489FB5",
  },
  button: {
    backgroundColor: "#FFA62B",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 30,
  },
  menuButton: {
    backgroundColor: "#16697A",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#EDE7E3",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default SearchFlightsScreen;
