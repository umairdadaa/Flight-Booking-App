import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import api from "../api";
import FlightCard from "../components/FlightCard";
import LottieView from "lottie-react-native";
import * as Animatable from "react-native-animatable";

const { width } = Dimensions.get("window");

export default function FlightListScreen({ route, navigation }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const { origin, destination, date } = route.params;
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useState({
    origin,
    destination,
    date: new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }),
  });
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await api.get("/flights", {
          params: { origin, destination, date },
        });
        setFlights(response.data);
        setLoading(false);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }).start();
      } catch (error) {
        console.error("Error fetching flights:", error);
        setLoading(false);
      }
    };

    fetchFlights();
  }, [origin, destination, date]);

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
        <Text style={styles.loadingText}>Searching for flights...</Text>
      </LinearGradient>
    );
  }

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
          <Text style={styles.title}>Available Flights</Text>
          <Text style={styles.subtitle}>
            {searchParams.origin} → {searchParams.destination} •{" "}
            {searchParams.date}
          </Text>
        </View>
      </Animatable.View>

      {/* Flight List */}
      {flights.length === 0 ? (
        <Animatable.View
          animation="fadeIn"
          duration={1000}
          style={styles.emptyContainer}
        >
          <MaterialIcons
            name="flight"
            size={60}
            color="rgba(255,255,255,0.3)"
          />
          <Text style={styles.emptyText}>No flights found for this route</Text>
          <Text style={styles.emptySubtext}>
            Try different dates or nearby airports
          </Text>

          <TouchableOpacity
            style={styles.searchAgainButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.searchAgainText}>Search Again</Text>
          </TouchableOpacity>
        </Animatable.View>
      ) : (
        <Animated.FlatList
          data={flights}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <Animatable.View
              animation="fadeInUp"
              duration={800}
              delay={index * 100}
            >
              <FlightCard
                flight={item}
                onPress={() =>
                  navigation.navigate("FlightDetails", {
                    flightId: item.id,
                    price: item.price,
                  })
                }
              />
            </Animatable.View>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          style={{ opacity: fadeAnim }}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
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
    color: "rgba(255,255,255,0.8)",
  },
  listContent: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "600",
    marginTop: 20,
    textAlign: "center",
  },
  emptySubtext: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
  },
  searchAgainButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginTop: 30,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  searchAgainText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "500",
  },
  filterButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#4FD3DA",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  filterText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

// export default FlightListScreen;
