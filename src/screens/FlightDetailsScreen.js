import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Animated,
  Dimensions
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialIcons, FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import api from "../api";
import LottieView from "lottie-react-native";
import * as Animatable from 'react-native-animatable';

const { width } = Dimensions.get('window');

export default function FlightDetailsScreen({ route, navigation }) {
  const { flightId } = route.params;
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const fetchFlightDetails = async () => {
      try {
        const response = await api.get(`/flights/${flightId}`);
        setFlight(response.data);
        setLoading(false);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true
        }).start();
      } catch (error) {
        console.error("Error fetching flight details:", error);
        setLoading(false);
      }
    };

    fetchFlightDetails();
  }, [flightId]);

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

  const calculateDuration = (departure, arrival) => {
    const diff = new Date(arrival) - new Date(departure);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const handleClassSelect = (seatClass) => {
    navigation.navigate("Booking", {
      selectedFlight: {
        flightId: flight.id,
        seatClassId: seatClass.seatClass.id,
        price: (flight.base_price * seatClass.seatClass.multiplier).toFixed(2),
        flightDetails: flight
      }
    });
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
        <Text style={styles.loadingText}>Loading flight details...</Text>
      </LinearGradient>
    );
  }

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
          <Text style={styles.title}>Flight Details</Text>
          <Text style={styles.subtitle}>{flight.airline.name} • {flight.flight_number}</Text>
        </View>
      </Animatable.View>

      <Animated.ScrollView 
        contentContainerStyle={styles.content}
        style={{ opacity: fadeAnim }}
      >
        {/* Flight Summary Card */}
        <Animatable.View 
          animation="fadeInUp" 
          duration={800}
          delay={200}
          style={styles.summaryCard}
        >
          <View style={styles.airlineHeader}>
            <View style={styles.airlineLogo}>
              <Text style={styles.airlineCode}>{flight.airline.code}</Text>
            </View>
            <View>
              <Text style={styles.airlineName}>{flight.airline.name}</Text>
              <Text style={styles.flightNumber}>Flight #{flight.flight_number}</Text>
            </View>
          </View>

          {/* Route Timeline */}
          <View style={styles.routeContainer}>
            <View style={styles.timeBlock}>
              <Text style={styles.time}>{formatTime(flight.departure_time)}</Text>
              <Text style={styles.airportCode}>{flight.origin.code}</Text>
              <Text style={styles.city}>{flight.origin.city}</Text>
            </View>

            <View style={styles.durationContainer}>
              <View style={styles.durationLine} />
              <MaterialCommunityIcons 
                name="airplane" 
                size={24} 
                color="#4FD3DA" 
                style={styles.airplaneIcon}
              />
              <Text style={styles.durationText}>
                {calculateDuration(flight.departure_time, flight.arrival_time)}
              </Text>
              <View style={styles.durationLine} />
            </View>

            <View style={styles.timeBlock}>
              <Text style={styles.time}>{formatTime(flight.arrival_time)}</Text>
              <Text style={styles.airportCode}>{flight.destination.code}</Text>
              <Text style={styles.city}>{flight.destination.city}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.dateStatusContainer}>
            <View style={styles.dateContainer}>
              <MaterialIcons name="date-range" size={16} color="#4FD3DA" />
              <Text style={styles.dateText}>{formatDate(flight.departure_time)}</Text>
            </View>
            <View style={[
              styles.statusBadge,
              flight.status === "On time" ? styles.onTimeBadge : styles.delayedBadge
            ]}>
              <Text style={styles.statusText}>{flight.status}</Text>
            </View>
          </View>
        </Animatable.View>

        {/* Flight Details Section */}
        <Animatable.View 
          animation="fadeInUp" 
          duration={800}
          delay={300}
          style={styles.detailsSection}
        >
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle" size={22} color="#2C5364" />
            <Text style={styles.sectionTitle}>Flight Information</Text>
          </View>

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <MaterialIcons name="airplanemode-active" size={20} color="#4FD3DA" />
              <Text style={styles.detailLabel}>Aircraft</Text>
              <Text style={styles.detailValue}>Boeing 787</Text>
            </View>

            <View style={styles.detailItem}>
              <Ionicons name="time" size={20} color="#4FD3DA" />
              <Text style={styles.detailLabel}>Duration</Text>
              <Text style={styles.detailValue}>
                {calculateDuration(flight.departure_time, flight.arrival_time)}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="seat-recline-normal" size={20} color="#4FD3DA" />
              <Text style={styles.detailLabel}>Seats</Text>
              <Text style={styles.detailValue}>186</Text>
            </View>

            <View style={styles.detailItem}>
              <FontAwesome name="plug" size={18} color="#4FD3DA" />
              <Text style={styles.detailLabel}>Power</Text>
              <Text style={styles.detailValue}>Available</Text>
            </View>
          </View>
        </Animatable.View>

        {/* Available Classes Section */}
        <Animatable.View 
          animation="fadeInUp" 
          duration={800}
          delay={400}
          style={styles.classesSection}
        >
          <View style={styles.sectionHeader}>
            <Ionicons name="pricetags" size={22} color="#2C5364" />
            <Text style={styles.sectionTitle}>Available Classes</Text>
          </View>

          {flight.flightSeats.map((seatClass, index) => (
            <TouchableOpacity
              key={seatClass.seatClass.id}
              style={styles.classCard}
              onPress={() => handleClassSelect(seatClass)}
              activeOpacity={0.7}
            >
              <View style={styles.classInfo}>
                <Text style={styles.className}>{seatClass.seatClass.name} Class</Text>
                <Text style={styles.classAvailability}>
                  {seatClass.available_seats} seats available
                </Text>
              </View>
              <View style={styles.priceContainer}>
                <Text style={styles.classPrice}>
                  ${(flight.base_price * seatClass.seatClass.multiplier).toFixed(2)}
                </Text>
                <MaterialIcons name="chevron-right" size={24} color="#4FD3DA" />
              </View>
            </TouchableOpacity>
          ))}
        </Animatable.View>
      </Animated.ScrollView>
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
    paddingBottom: 100,
  },
  summaryCard: {
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
  airlineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  airlineLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2C5364',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  airlineCode: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  airlineName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C5364',
  },
  flightNumber: {
    fontSize: 14,
    color: '#4FD3DA',
    marginTop: 5,
  },
  routeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  timeBlock: {
    alignItems: 'center',
    flex: 1,
  },
  time: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C5364',
    marginBottom: 5,
  },
  airportCode: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4FD3DA',
    marginBottom: 3,
  },
  city: {
    fontSize: 14,
    color: '#6B7280',
  },
  durationContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    width: 100,
  },
  durationLine: {
    width: 1,
    height: 20,
    backgroundColor: '#4FD3DA',
    opacity: 0.5,
  },
  airplaneIcon: {
    marginVertical: 5,
    transform: [{ rotate: '90deg' }],
  },
  durationText: {
    fontSize: 12,
    color: '#6B7280',
    marginVertical: 5,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 15,
  },
  dateStatusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 5,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  onTimeBadge: {
    backgroundColor: '#D1FAE5',
  },
  delayedBadge: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  detailsSection: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
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
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailItem: {
    width: width * 0.43,
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 5,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C5364',
    marginTop: 3,
  },
  classesSection: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  classCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
  },
  classInfo: {
    flex: 1,
  },
  className: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C5364',
  },
  classAvailability: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 5,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  classPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4FD3DA',
    marginRight: 5,
  },
});

// export default FlightDetailsScreen;