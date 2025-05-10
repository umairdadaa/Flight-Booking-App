import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  Animated,
  Dimensions,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import * as Print from "expo-print";
import api from "../api";

const { width } = Dimensions.get("window");

export default function CheckInScreen({ navigation }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const [name, setName] = useState("");
  const [bookingReference, setBookingReference] = useState("");
  const [age, setAge] = useState("");
  const [passportNumber, setPassportNumber] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleCheckIn = async () => {
    try {
      setLoading(true);
      setError("");
      setResult(null);

      if (
        !name.trim() ||
        !bookingReference.trim() ||
        !age.trim() ||
        !passportNumber.trim()
      ) {
        Alert.alert(
          "Missing Information",
          "Please fill in all fields to check in.",
          [{ text: "OK", style: "cancel" }]
        );
        return;
      }

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

  const printBoardingPass = async () => {
    if (!result) return;

    const formatTime = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    };

    const gate = `G${Math.floor(10 + Math.random() * 50)}`;
    const flightNumber = `ST${Math.floor(100 + Math.random() * 900)}`;
    const boardingTime = new Date(result.booking.booked_at);
    boardingTime.setHours(boardingTime.getHours() + 1);

    const passengerPasses = result.passengers
      .map((passenger, index) => {
        return `
        <div class="boarding-pass" style="${
          index > 0 ? "margin-top: 30px;" : ""
        }">
          <div class="airline-header">
            <h1 class="airline-name">STAMPEDD AIR</h1>
            <p class="boarding-pass-title">BOARDING PASS ${index + 1} of ${
          result.passengers.length
        }</p>
          </div>
          
          <div class="passenger-info">
            <div class="passenger-photo">PHOTO</div>
            <div style="flex: 1;">
              <div class="info-section">
                <div class="info-label">Passenger Name</div>
                <div class="info-value">${passenger.fullName}</div>
                
                <div class="info-label">Flight Number</div>
                <div class="info-value">${flightNumber}</div>
              </div>
              
              <div class="info-section">
                <div class="info-label">From</div>
                <div class="info-value">JFK</div>
                
                <div class="info-label">To</div>
                <div class="info-value">LAX</div>
              </div>
              
              <div class="info-section">
                <div class="info-label">Date</div>
                <div class="info-value">${formatDate(
                  result.booking.booked_at
                )}</div>
                
                <div class="info-label">Time</div>
                <div class="info-value">${formatTime(
                  result.booking.booked_at
                )}</div>
              </div>
            </div>
          </div>
          
          <div class="flight-info">
            <div class="info-section">
              <div class="info-label">Class</div>
              <div class="info-value">ECONOMY</div>
              
              <div class="info-label">Terminal</div>
              <div class="info-value">T${Math.floor(
                1 + Math.random() * 5
              )}</div>
            </div>
            
            <div class="info-section">
              <div class="info-label">Gate</div>
              <div class="info-value-large">${gate}</div>
              
              <div class="info-label">Boarding</div>
              <div class="info-value">${formatTime(boardingTime)}</div>
            </div>
            
            <div class="info-section">
              <div class="info-label">Seat</div>
              <div class="info-value-large">${
                passenger.assignedSeat || "TBD"
              }</div>
              
              <div class="info-label">Sequence</div>
              <div class="info-value">${Math.floor(
                1 + Math.random() * 300
              )}</div>
            </div>
          </div>
          
          <div class="terminal-map">
            Terminal Map - Gate ${gate}
          </div>
          
          <div class="barcode">
            <div class="barcode-placeholder"></div>
            <div class="barcode-number">${result.booking.booking_reference.replace(
              /-/g,
              ""
            )}-${index + 1}</div>
          </div>
          
          <div class="security-info">
            <strong>SECURITY INFORMATION:</strong> This boarding pass is only valid with a matching government-issued photo ID.
          </div>
          
          ${
            index === result.passengers.length - 1
              ? `
            <div class="footer-note">
              <p>Please be at the gate at least 30 minutes before departure</p>
              <p>© ${new Date().getFullYear()} STAMPEDD AIR. All rights reserved.</p>
            </div>
          `
              : ""
          }
        </div>
      `;
      })
      .join("");

    const html = `
      <html>
        <head>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@300;400;700&display=swap');
            
            body {
              font-family: 'Roboto Condensed', sans-serif;
              margin: 0;
              padding: 20px;
              background-color: #f5f5f5;
            }
            .boarding-pass {
              width: 100%;
              max-width: 800px;
              margin: 0 auto;
              background: white;
              box-shadow: 0 5px 15px rgba(0,0,0,0.1);
              border-radius: 8px;
              overflow: hidden;
            }
            .airline-header {
              background: linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%);
              color: white;
              padding: 20px;
              text-align: center;
              position: relative;
            }
            .airline-name {
              font-size: 28px;
              font-weight: 700;
              letter-spacing: 1px;
              margin: 0;
            }
            .boarding-pass-title {
              font-size: 18px;
              margin: 5px 0 0 0;
              opacity: 0.9;
            }
            .passenger-info {
              display: flex;
              padding: 25px;
              border-bottom: 1px dashed #ccc;
            }
            .flight-info {
              display: flex;
              padding: 20px;
              background: #f9f9f9;
            }
            .info-section {
              flex: 1;
              padding: 0 15px;
            }
            .info-section:not(:last-child) {
              border-right: 1px dashed #ddd;
            }
            .info-label {
              font-size: 12px;
              color: #666;
              text-transform: uppercase;
              margin-bottom: 5px;
              letter-spacing: 0.5px;
            }
            .info-value {
              font-size: 18px;
              font-weight: 700;
              color: #333;
              margin-bottom: 15px;
            }
            .info-value-large {
              font-size: 24px;
              color: #0F2027;
            }
            .barcode {
              text-align: center;
              padding: 20px;
              background: #f5f5f5;
              margin-top: 10px;
            }
            .barcode-placeholder {
              height: 60px;
              background: #333;
              width: 100%;
              margin: 0 auto;
              position: relative;
            }
            .barcode-number {
              font-family: 'Libre Barcode 128', cursive;
              font-size: 36px;
              letter-spacing: 2px;
              margin-top: 10px;
            }
            .footer-note {
              text-align: center;
              padding: 15px;
              font-size: 12px;
              color: #777;
              background: #f9f9f9;
            }
            .passenger-photo {
              width: 80px;
              height: 80px;
              background: #eee;
              border-radius: 5px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #999;
              font-size: 12px;
              margin-right: 20px;
            }
            .security-info {
              padding: 15px;
              background: #fff8e1;
              border-top: 1px solid #ffecb3;
              font-size: 12px;
              color: #5d4037;
            }
            .terminal-map {
              height: 100px;
              background: #e3f2fd;
              margin: 15px;
              border-radius: 5px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #0d47a1;
              font-size: 14px;
            }
            .multi-passenger-notice {
              text-align: center;
              padding: 15px;
              background: #e8f5e9;
              color: #2e7d32;
              font-weight: bold;
              margin-bottom: 20px;
              border-radius: 5px;
            }
          </style>
        </head>
        <body>
          ${
            result.passengers.length > 1
              ? `
            <div class="multi-passenger-notice">
              Your group has ${result.passengers.length} boarding passes below
            </div>
          `
              : ""
          }
          
          ${passengerPasses}
        </body>
      </html>
    `;

    try {
      await Print.printAsync({ html });
    } catch (error) {
      console.error("Error while printing the boarding pass:", error);
    }
  };

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
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={28} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Online Check-In</Text>
            <Text style={styles.subtitle}>Complete your check-in process</Text>
          </View>
        </Animatable.View>

        {/* Hero Image */}
        <Animatable.View
          animation="fadeIn"
          duration={1000}
          style={styles.heroContainer}
        >
          <Image
            source={require("../assets/images/airline/airplane.png")}
            style={styles.heroImage}
            resizeMode="contain"
          />
        </Animatable.View>

        {/* Form Section */}
        <Animatable.View
          animation="fadeInUp"
          duration={800}
          delay={200}
          style={styles.formContainer}
        >
          <View style={styles.inputContainer}>
            <Ionicons
              name="person-outline"
              size={20}
              color={focusedInput === "name" ? "#4FD3DA" : "#AAA"}
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Full Name"
              placeholderTextColor="#AAA"
              style={[
                styles.input,
                focusedInput === "name" && styles.inputFocused,
              ]}
              value={name}
              onChangeText={setName}
              onFocus={() => setFocusedInput("name")}
              onBlur={() => setFocusedInput(null)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name="receipt-outline"
              size={20}
              color={focusedInput === "bookingReference" ? "#4FD3DA" : "#AAA"}
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Booking Reference"
              placeholderTextColor="#AAA"
              style={[
                styles.input,
                focusedInput === "bookingReference" && styles.inputFocused,
              ]}
              value={bookingReference}
              onChangeText={setBookingReference}
              onFocus={() => setFocusedInput("bookingReference")}
              onBlur={() => setFocusedInput(null)}
              autoCapitalize="characters"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name="time-outline"
              size={20}
              color={focusedInput === "age" ? "#4FD3DA" : "#AAA"}
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Age"
              placeholderTextColor="#AAA"
              style={[
                styles.input,
                focusedInput === "age" && styles.inputFocused,
              ]}
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
              onFocus={() => setFocusedInput("age")}
              onBlur={() => setFocusedInput(null)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name="document-text-outline"
              size={20}
              color={focusedInput === "passportNumber" ? "#4FD3DA" : "#AAA"}
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Passport Number"
              placeholderTextColor="#AAA"
              style={[
                styles.input,
                focusedInput === "passportNumber" && styles.inputFocused,
              ]}
              value={passportNumber}
              onChangeText={setPassportNumber}
              onFocus={() => setFocusedInput("passportNumber")}
              onBlur={() => setFocusedInput(null)}
              autoCapitalize="characters"
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleCheckIn}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>Check In Now</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFF" />
              </View>
            )}
          </TouchableOpacity>

          {error && (
            <Animatable.View
              animation="fadeIn"
              duration={500}
              style={styles.errorContainer}
            >
              <Ionicons name="warning-outline" size={20} color="#FF6B6B" />
              <Text style={styles.errorText}>{error}</Text>
            </Animatable.View>
          )}
        </Animatable.View>

        {/* Results Section */}
        {result && (
          <Animatable.View
            animation="fadeInUp"
            duration={800}
            delay={200}
            style={styles.resultContainer}
          >
            <View style={styles.successHeader}>
              <Ionicons name="checkmark-circle" size={32} color="#4FD3DA" />
              <Text style={styles.successTitle}>{result.message}</Text>
            </View>

            <View style={styles.bookingCard}>
              <Text style={styles.cardTitle}>Booking Details</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Reference:</Text>
                <Text style={styles.detailValue}>
                  {result.booking.booking_reference}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Status:</Text>
                <Text style={[styles.detailValue, styles.statusSuccess]}>
                  {result.booking.status}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Booked On:</Text>
                <Text style={styles.detailValue}>
                  {new Date(result.booking.booked_at).toLocaleDateString()}
                </Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Passengers</Text>

            {result.passengers.map((passenger, index) => (
              <Animatable.View
                key={index}
                animation="fadeInUp"
                duration={600}
                delay={100 * index}
                style={styles.passengerCard}
              >
                <View style={styles.passengerHeader}>
                  <Text style={styles.passengerName}>{passenger.fullName}</Text>
                  <View style={styles.seatBadge}>
                    <Text style={styles.seatText}>
                      Seat: {passenger.assignedSeat || "TBD"}
                    </Text>
                  </View>
                </View>
                <View style={styles.passengerDetails}>
                  <Text style={styles.passengerDetail}>
                    Age: {passenger.age}
                  </Text>
                  <Text style={styles.passengerDetail}>
                    Passport: {passenger.passportNumber}
                  </Text>
                </View>
              </Animatable.View>
            ))}

            <View style={styles.instructionsCard}>
              <Ionicons
                name="information-circle-outline"
                size={24}
                color="#4FD3DA"
              />
              <Text style={styles.instructionsText}>
                Please proceed to the check-in counters if you have luggage or
                use the self-service kiosk at the airport.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.downloadButton}
              onPress={printBoardingPass}
              activeOpacity={0.8}
            >
              <Ionicons name="print-outline" size={20} color="#FFF" />
              <Text style={styles.downloadButtonText}>Print Boarding Pass</Text>
            </TouchableOpacity>
          </Animatable.View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

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
  heroContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  heroImage: {
    width: "100%",
    height: 150,
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
  button: {
    backgroundColor: "#4FD3DA",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#4FD3DA",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#90CAF9",
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
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFEEEE",
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
  },
  errorText: {
    color: "#FF6B6B",
    marginLeft: 8,
    fontSize: 14,
  },
  resultContainer: {
    backgroundColor: "#FFF",
    borderRadius: 30,
    padding: 25,
    marginTop: 20,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  successHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#4FD3DA",
    marginLeft: 10,
  },
  bookingCard: {
    backgroundColor: "#F5F7FA",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    color: "#333",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  statusSuccess: {
    color: "#4FD3DA",
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  passengerCard: {
    backgroundColor: "#F5F7FA",
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
  },
  passengerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  passengerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  seatBadge: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  seatText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1E88E5",
  },
  passengerDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  passengerDetail: {
    fontSize: 14,
    color: "#666",
  },
  instructionsCard: {
    flexDirection: "row",
    backgroundColor: "#E3F2FD",
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    marginBottom: 20,
  },
  instructionsText: {
    flex: 1,
    fontSize: 14,
    color: "#1E88E5",
    marginLeft: 10,
  },
  downloadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4FD3DA",
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
    shadowColor: "#4FD3DA",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  downloadButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
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
});
