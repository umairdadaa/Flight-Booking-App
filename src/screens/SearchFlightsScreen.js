import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
  Animated,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

const { width } = Dimensions.get("window");

const SearchFlightsScreen = ({ navigation }) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  };

  const validateAndNavigate = () => {
    if (!origin.trim() || !destination.trim()) {
      Alert.alert(
        "Missing Information",
        "Please enter both origin and destination.",
        [{ text: "OK", style: "cancel" }]
      );
      return;
    }

    navigation.navigate("Flights", {
      origin,
      destination,
      date: date.toISOString().split("T")[0],
    });
  };

  const menuOptions = [
    {
      icon: "airplane-outline",
      text: "All Flights",
      action: () =>
        navigation.navigate("Flights", {
          origin: "",
          destination: "",
          date: "",
        }),
    },
    {
      icon: "remove-circle-outline",
      text: "Cancel Booking",
      action: () => navigation.navigate("CancelBookingScreen"),
    },
    {
      icon: "bag-check-outline",
      text: "Check In",
      action: () => navigation.navigate("CheckInScreen"),
    },
    {
      icon: "information-circle-outline",
      text: "Flight Status",
      action: () => navigation.navigate("ViewBookingScreen"),
    },
  ];

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
          <View style={styles.headerContent}>
            <Text style={styles.title}>Find Your Flight</Text>
            <Text style={styles.subtitle}>Search for available flights</Text>
          </View>
        </Animatable.View>

        {/* Search Form */}
        <Animatable.View
          animation="fadeInUp"
          duration={800}
          delay={200}
          style={styles.formContainer}
        >
          <View style={styles.inputContainer}>
            <Ionicons
              name="location-outline"
              size={20}
              color={focusedInput === "origin" ? "#4FD3DA" : "#AAA"}
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="From (City or Airport)"
              placeholderTextColor="#AAA"
              style={[
                styles.input,
                focusedInput === "origin" && styles.inputFocused,
              ]}
              value={origin}
              onChangeText={setOrigin}
              onFocus={() => setFocusedInput("origin")}
              onBlur={() => setFocusedInput(null)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name="location"
              size={20}
              color={focusedInput === "destination" ? "#4FD3DA" : "#AAA"}
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="To (City or Airport)"
              placeholderTextColor="#AAA"
              style={[
                styles.input,
                focusedInput === "destination" && styles.inputFocused,
              ]}
              value={destination}
              onChangeText={setDestination}
              onFocus={() => setFocusedInput("destination")}
              onBlur={() => setFocusedInput(null)}
            />
          </View>

          <TouchableOpacity
            style={styles.dateInputContainer}
            onPress={() => setShowDatePicker(true)}
            activeOpacity={0.8}
          >
            <MaterialIcons
              name="date-range"
              size={20}
              color="#4FD3DA"
              style={styles.inputIcon}
            />
            <Animated.Text style={[styles.dateText, { opacity: fadeAnim }]}>
              {formatDate(date)}
            </Animated.Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              minimumDate={new Date()}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onChangeDate}
              textColor="#2C5364"
            />
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={validateAndNavigate}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>Search Flights</Text>
              <Ionicons name="search" size={20} color="#FFF" />
            </View>
          </TouchableOpacity>
        </Animatable.View>

        {/* Quick Access Menu */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Quick Access</Text>

          <View style={styles.menuGrid}>
            {menuOptions.map((item, index) => (
              <Animatable.View
                key={index}
                animation="fadeInUp"
                duration={800}
                delay={200 + index * 100}
              >
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={item.action}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuIconContainer}>
                    <Ionicons name={item.icon} size={26} color="#4FD3DA" />
                  </View>
                  <Text style={styles.menuItemText}>{item.text}</Text>
                </TouchableOpacity>
              </Animatable.View>
            ))}
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  header: {
    padding: 25,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "rgba(0,0,0,0.2)",
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
  dateInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 20,
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#4FD3DA",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#4FD3DA",
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
  menuSection: {
    paddingHorizontal: 25,
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 20,
  },
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  menuItem: {
    width: width * 0.43,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  menuIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  menuItemText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
});

export default SearchFlightsScreen;
