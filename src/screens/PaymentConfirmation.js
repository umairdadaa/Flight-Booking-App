import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Ionicons,
  MaterialIcons,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import LottieView from "lottie-react-native";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";
import api from "../api";

const { width } = Dimensions.get("window");

export default function PaymentConfirmation({ route, navigation }) {
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const { bookingReference, fullName } = route.params; // Receive data from the previous page

  const passengerName = fullName;

  // const [passengerName] = useState("Mike");
  // const [bookingReference] = useState("1VNCV3Z3");

  useEffect(() => {
    navigation.setOptions({ headerShown: false });

    const fetchBookingDetails = async () => {
      setLoading(true);
      try {
        const response = await api.post("/bookings/ref", {
          bookingReference,
          passengerName,
        });
        setBookingDetails(response.data.booking);
      } catch (error) {
        console.error("Error fetching booking details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, []);

  const handleHomePress = () => {
    navigation.navigate("SearchFlightsScreen");
  };

  const generatePDF = async () => {
    // Extract passenger details from the booking data
    const passengers = bookingDetails?.passengers || [];
    const passengerNames = passengers
      .map((passenger) => passenger.full_name)
      .join(", ");

    // Format currency
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
    };

    // Build the HTML content for the PDF
    const html = `
      <html>
        <head>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');
            
            body {
              font-family: 'Poppins', sans-serif;
              background-color: #ffffff;
              margin: 0;
              padding: 0;
              color: #333;
            }
            .container {
              max-width: 800px;
              margin: 0 auto;
              padding: 40px;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 1px solid #eaeaea;
              padding-bottom: 20px;
            }
            .logo {
              font-size: 24px;
              font-weight: 700;
              color: #16697A;
              margin-bottom: 10px;
            }
            .confirmation-number {
              background: #f8f8f8;
              padding: 8px 15px;
              border-radius: 20px;
              display: inline-block;
              font-size: 14px;
              margin: 10px 0;
            }
            h1 {
              color: #16697A;
              font-size: 28px;
              margin: 0;
            }
            h2 {
              color: #489FB5;
              font-size: 18px;
              margin: 25px 0 15px 0;
              position: relative;
              padding-left: 15px;
            }
            h2:before {
              content: "";
              position: absolute;
              left: 0;
              top: 5px;
              height: 15px;
              width: 5px;
              background: #489FB5;
              border-radius: 3px;
            }
            .info-card {
              background: #f9f9f9;
              border-radius: 8px;
              padding: 20px;
              margin-bottom: 20px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            }
            .info-row {
              display: flex;
              margin-bottom: 8px;
            }
            .info-label {
              font-weight: 600;
              width: 150px;
              color: #555;
            }
            .info-value {
              flex: 1;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
              box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            }
            th {
              background-color: #16697A;
              color: white;
              padding: 12px;
              text-align: left;
              font-weight: 500;
            }
            td {
              padding: 12px;
              border-bottom: 1px solid #eaeaea;
            }
            tr:last-child td {
              border-bottom: none;
            }
            tr:hover {
              background-color: #f5f5f5;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #eaeaea;
              font-size: 12px;
              color: #777;
            }
            .qr-code {
              text-align: center;
              margin: 20px 0;
            }
            .qr-code img {
              width: 120px;
              height: 120px;
              border: 1px solid #eaeaea;
              padding: 10px;
              background: white;
            }
            .highlight {
              color: #16697A;
              font-weight: 600;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">STAMPEDD!</div>
              <div class="confirmation-number">Booking Reference: ${
                bookingDetails?.booking_reference || "N/A"
              }</div>
              <h1>Flight Booking Confirmation</h1>
              <p>Thank you for choosing STAMPEDD! Your journey begins here.</p>
            </div>

            <div class="info-card">
              <div class="info-row">
                <div class="info-label">Booking Date:</div>
                <div class="info-value">${new Date().toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Passengers:</div>
                <div class="info-value">${passengerNames}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Total Paid:</div>
                <div class="info-value highlight">${formatCurrency(
                  bookingDetails?.payment.amount || 0
                )}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Status:</div>
                <div class="info-value" style="color: #4CAF50; font-weight: 600;">Confirmed</div>
              </div>
            </div>

            <h2>Flight Details</h2>
            <div class="info-card">
              <div class="info-row">
                <div class="info-label">Flight Number:</div>
                <div class="info-value">${
                  bookingDetails?.flight.flight_number || "N/A"
                }</div>
              </div>
              <div class="info-row">
                <div class="info-label">Departure:</div>
                <div class="info-value">${new Date(
                  bookingDetails?.flight.departure_time
                ).toLocaleString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Travel Class:</div>
                <div class="info-value">Economy Class</div>
              </div>
            </div>

            <h2>Passenger Details</h2>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Seat</th>
                  <th>Ticket Number</th>
                </thead>
              <tbody>
                ${passengers
                  .map(
                    (passenger) => `
                    <tr>
                      <td>${passenger.full_name}</td>
                      <td>${passenger.age}</td>
                      <td>${
                        passenger.selected_seat
                          ? passenger.selected_seat
                          : "TBD"
                      }</td>
                      <td>${
                        "TK" + Math.floor(10000000 + Math.random() * 90000000)
                      }</td>
                    </tr>
                  `
                  )
                  .join("")}
              </tbody>
            </table>

            <h2>Payment Information</h2>
            <div class="info-card">
              <div class="info-row">
                <div class="info-label">Payment Method:</div>
                <div class="info-value">${
                  bookingDetails?.payment.method || "N/A"
                }</div>
              </div>
              <div class="info-row">
                <div class="info-label">Amount Paid:</div>
                <div class="info-value highlight">${formatCurrency(
                  bookingDetails?.payment.amount || 0
                )}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Transaction ID:</div>
                <div class="info-value">${
                  "TXN" + Math.floor(100000000 + Math.random() * 900000000)
                }</div>
              </div>
              <div class="info-row">
                <div class="info-label">Payment Date:</div>
                <div class="info-value">${new Date().toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}</div>
              </div>
            </div>

            <div class="qr-code">
              <!-- Placeholder for QR code - in a real app you would generate one -->
              <div style="border: 1px dashed #ccc; width: 120px; height: 120px; margin: 0 auto; display: flex; align-items: center; justify-content: center; color: #999;">
                QR Code
              </div>
              <p style="font-size: 12px; color: #777;">Scan this code at check-in</p>
            </div>

            <div class="footer">
              <p>Need help? Contact our customer service at support@stamped.com or +1 (800) 123-4567</p>
              <p>© ${new Date().getFullYear()} STAMPEDD! Airlines. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html });
      console.log("PDF created at:", uri);

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri, {
          title: "Your STAMPEDD! Booking Confirmation",
          dialogTitle: "Share Booking Confirmation",
        });
      } else {
        alert("Sharing not available on this device.");
      }
    } catch (error) {
      console.error("PDF generation error:", error);
      alert("Error", "Could not generate or share PDF.");
    }
  };

  if (loading) {
    return (
      <LinearGradient
        colors={["#0F2027", "#203A43", "#2C5364"]}
        style={styles.loadingContainer}
      >
        <LottieView
          source={require("../assets/lottie/loading.json")}
          autoPlay
          loop
          style={{ width: 150, height: 150 }}
        />
        <Text style={styles.loadingText}>Loading your booking details...</Text>
      </LinearGradient>
    );
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

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
          <Text style={styles.title}>Booking Confirmed</Text>
          <Text style={styles.subtitle}>Your flight is all set!</Text>
        </View>
      </Animatable.View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Success Card */}
        <Animatable.View
          animation="fadeInUp"
          duration={800}
          delay={200}
          style={styles.successCard}
        >
          <View style={styles.successHeader}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark-done" size={36} color="#10B981" />
            </View>
            <Text style={styles.successTitle}>Booking Successful</Text>
            <Text style={styles.successMessage}>
              Thank you for choosing our airline. Your booking reference is:
            </Text>
            <View style={styles.referenceContainer}>
              <Text style={styles.referenceText}>{bookingReference}</Text>
            </View>
          </View>

          {/* Booking Summary */}
          <View style={styles.summarySection}>
            <View style={styles.summaryRow}>
              <MaterialIcons name="person" size={20} color="#4FD3DA" />
              <Text style={styles.summaryLabel}>Passenger:</Text>
              <Text style={styles.summaryValue}>
                {bookingDetails?.passengers[0]?.full_name || passengerName}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <MaterialIcons name="date-range" size={20} color="#4FD3DA" />
              <Text style={styles.summaryLabel}>Booked On:</Text>
              <Text style={styles.summaryValue}>
                {formatDate(bookingDetails?.booked_at)}
              </Text>
            </View>
          </View>
        </Animatable.View>

        {/* Flight Details */}
        {bookingDetails && (
          <Animatable.View
            animation="fadeInUp"
            duration={800}
            delay={300}
            style={styles.detailsCard}
          >
            <View style={styles.sectionHeader}>
              <Ionicons name="airplane" size={22} color="#2C5364" />
              <Text style={styles.sectionTitle}>Flight Details</Text>
            </View>

            <View style={styles.flightRoute}>
              <View style={styles.airport}>
                <Text style={styles.airportCode}>
                  {bookingDetails.flight.origin.code}
                </Text>
                <Text style={styles.airportCity}>
                  {bookingDetails.flight.origin.city}
                </Text>
                <Text style={styles.flightTime}>
                  {formatTime(bookingDetails.flight.departure_time)}
                </Text>
                <Text style={styles.flightDate}>
                  {formatDate(bookingDetails.flight.departure_time)}
                </Text>
              </View>

              <View style={styles.flightTimeline}>
                <View style={styles.flightLine} />
                <MaterialCommunityIcons
                  name="airplane"
                  size={24}
                  color="#4FD3DA"
                  style={styles.airplaneIcon}
                />
                <View style={styles.flightLine} />
              </View>

              <View style={styles.airport}>
                <Text style={styles.airportCode}>
                  {bookingDetails.flight.destination.code}
                </Text>
                <Text style={styles.airportCity}>
                  {bookingDetails.flight.destination.city}
                </Text>
                <Text style={styles.flightTime}>
                  {formatTime(bookingDetails.flight.arrival_time)}
                </Text>
                <Text style={styles.flightDate}>
                  {formatDate(bookingDetails.flight.arrival_time)}
                </Text>
              </View>
            </View>

            <View style={styles.flightInfo}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Flight Number</Text>
                <Text style={styles.infoValue}>
                  {bookingDetails.flight.flight_number}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Class</Text>
                <Text style={styles.infoValue}>
                  {bookingDetails.seat_class?.name || "Economy"}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Airline</Text>
                <Text style={styles.infoValue}>
                  {bookingDetails.flight.airline.name}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Duration</Text>
                <Text style={styles.infoValue}>
                  {/* Calculate duration here */}
                </Text>
              </View>
            </View>
          </Animatable.View>
        )}

        {/* Payment Details */}
        {bookingDetails && (
          <Animatable.View
            animation="fadeInUp"
            duration={800}
            delay={400}
            style={styles.detailsCard}
          >
            <View style={styles.sectionHeader}>
              <FontAwesome name="credit-card" size={20} color="#2C5364" />
              <Text style={styles.sectionTitle}>Payment Information</Text>
            </View>

            <View style={styles.paymentInfo}>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Payment Method</Text>
                <Text style={styles.paymentValue}>
                  {bookingDetails.payment.method}
                </Text>
              </View>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Amount Paid</Text>
                <Text style={styles.paymentAmount}>
                  ${bookingDetails.payment.amount}
                </Text>
              </View>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Transaction ID</Text>
                <Text style={styles.paymentValue}>
                  {bookingDetails.payment.transaction_id || "N/A"}
                </Text>
              </View>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Status</Text>
                <Text style={[styles.paymentValue, styles.paymentSuccess]}>
                  Completed
                </Text>
              </View>
            </View>
          </Animatable.View>
        )}

        {/* Download Ticket */}
        <Animatable.View
          animation="fadeInUp"
          duration={800}
          delay={500}
          style={styles.downloadCard}
        >
          <View style={styles.sectionHeader}>
            <MaterialIcons
              name="confirmation-number"
              size={22}
              color="#2C5364"
            />
            <Text style={styles.sectionTitle}>Your Ticket</Text>
          </View>
          <Text style={styles.downloadText}>
            Download your e-ticket or share it with your travel companions.
          </Text>
          <TouchableOpacity
            style={styles.downloadButton}
            onPress={generatePDF}
            activeOpacity={0.8}
          >
            <Ionicons name="download" size={20} color="#FFF" />
            <Text style={styles.downloadButtonText}>Download Ticket</Text>
          </TouchableOpacity>
        </Animatable.View>
      </ScrollView>

      {/* Footer Button */}
      <Animatable.View
        animation="fadeInUp"
        duration={800}
        delay={600}
        style={styles.footer}
      >
        <TouchableOpacity
          style={styles.homeButton}
          onPress={handleHomePress}
          activeOpacity={0.8}
        >
          <Text style={styles.homeButtonText}>Back to Home</Text>
          <Ionicons name="home" size={20} color="#FFF" />
        </TouchableOpacity>
      </Animatable.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#FFF",
    fontSize: 16,
    marginTop: 20,
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
    color: "rgba(255,255,255,0.8)"
  },
  content: {
    padding: 20,
    paddingBottom: 120,
  },
  successCard: {
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
  successHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  successIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2C5364",
    marginBottom: 10,
  },
  successMessage: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
  },
  referenceContainer: {
    backgroundColor: "#F5F7FA",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginTop: 15,
  },
  referenceText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C5364",
  },
  summarySection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#6B7280",
    marginLeft: 8,
    marginRight: 12,
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C5364",
  },
  detailsCard: {
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
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2C5364",
    marginLeft: 8,
  },
  flightRoute: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  airport: {
    alignItems: "center",
    flex: 1,
  },
  airportCode: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2C5364",
    marginBottom: 5,
  },
  airportCity: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 10,
  },
  flightTime: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2C5364",
  },
  flightDate: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  flightTimeline: {
    alignItems: "center",
    width: 80,
  },
  flightLine: {
    height: 1,
    width: "80%",
    backgroundColor: "#D1D5DB",
  },
  airplaneIcon: {
    marginVertical: 5,
    transform: [{ rotate: "90deg" }],
  },
  flightInfo: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  infoItem: {
    width: "48%",
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C5364",
  },
  paymentInfo: {
    marginTop: 10,
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  paymentLabel: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  paymentValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C5364",
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#10B981",
  },
  paymentSuccess: {
    color: "#10B981",
  },
  downloadCard: {
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
  downloadText: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 20,
    lineHeight: 24,
  },
  downloadButton: {
    backgroundColor: "#2C5364",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2C5364",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  downloadButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFF",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  homeButton: {
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
  homeButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
    marginRight: 10,
  },
});

// export default PaymentConfirmation;
