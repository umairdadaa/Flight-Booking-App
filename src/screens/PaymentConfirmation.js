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
import { Ionicons, MaterialIcons, FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Animatable from 'react-native-animatable';
import LottieView from 'lottie-react-native';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import api from "../api";

const { width } = Dimensions.get("window");

export default function PaymentConfirmation({ route, navigation }) {
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [passengerName] = useState("Mike");
  const [bookingReference] = useState("1VNCV3Z3");

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
    // PDF generation logic remains the same as your original
    // ... (include all your existing PDF generation code)
  };

  if (loading) {
    return (
      <LinearGradient colors={["#0F2027", "#203A43", "#2C5364"]} style={styles.loadingContainer}>
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
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <LinearGradient colors={["#0F2027", "#203A43", "#2C5364"]} style={styles.container}>
      {/* Header */}
      <Animatable.View animation="fadeInDown" duration={800} style={styles.header}>
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
            <MaterialIcons name="confirmation-number" size={22} color="#2C5364" />
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFF',
    fontSize: 16,
    marginTop: 20,
  },
  header: {
    padding: 25,
    paddingTop: 50,
    paddingBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  backButton: {
    marginRight: 15,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  content: {
    padding: 20,
    paddingBottom: 120,
  },
  successCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  successHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  successIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2C5364',
    marginBottom: 10,
  },
  successMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  referenceContainer: {
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginTop: 15,
  },
  referenceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C5364',
  },
  summarySection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 8,
    marginRight: 12,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C5364',
  },
  detailsCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C5364',
    marginLeft: 8,
  },
  flightRoute: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  airport: {
    alignItems: 'center',
    flex: 1,
  },
  airportCode: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C5364',
    marginBottom: 5,
  },
  airportCity: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 10,
  },
  flightTime: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C5364',
  },
  flightDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  flightTimeline: {
    alignItems: 'center',
    width: 80,
  },
  flightLine: {
    height: 1,
    width: '80%',
    backgroundColor: '#D1D5DB',
  },
  airplaneIcon: {
    marginVertical: 5,
    transform: [{ rotate: '90deg' }],
  },
  flightInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoItem: {
    width: '48%',
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C5364',
  },
  paymentInfo: {
    marginTop: 10,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  paymentLabel: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  paymentValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C5364',
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10B981',
  },
  paymentSuccess: {
    color: '#10B981',
  },
  downloadCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  downloadText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20,
    lineHeight: 24,
  },
  downloadButton: {
    backgroundColor: '#2C5364',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2C5364',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  downloadButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  homeButton: {
    backgroundColor: '#4FD3DA',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4FD3DA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  homeButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 10,
  },
});

// export default PaymentConfirmation;