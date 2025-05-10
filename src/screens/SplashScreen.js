import React, { useEffect } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

const SplashScreen = ({ navigation }) => {
  const scaleValue = new Animated.Value(0);
  const fadeValue = new Animated.Value(0);

  useEffect(() => {
    // Animation sequence
    Animated.parallel([
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.elastic(1),
        useNativeDriver: true,
      }),
      Animated.timing(fadeValue, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigation timeout
    const timeout = setTimeout(() => {
      navigation.replace("Home");
    }, 3500);

    return () => clearTimeout(timeout);
  }, [navigation]);

  return (
    <LinearGradient
      colors={["#0F2027", "#203A43", "#2C5364"]}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.logoContainer,
          {
            transform: [{ scale: scaleValue }],
            opacity: fadeValue,
          },
        ]}
      >
        <Animatable.View
          animation="pulse"
          duration={2000}
          iterationCount="infinite"
          style={styles.circle}
        >
          <Ionicons name="airplane" size={60} color="#4FD3DA" />
        </Animatable.View>

        <Animatable.Text
          animation="fadeInUp"
          duration={1000}
          delay={300}
          style={styles.title}
        >
          Stampedd
        </Animatable.Text>

        <Animatable.Text
          animation="fadeInUp"
          duration={1000}
          delay={500}
          style={styles.subtitle}
        >
          Your Journey Begins Here
        </Animatable.Text>
      </Animated.View>

      <Animatable.View
        animation="fadeInUp"
        duration={1000}
        delay={700}
        style={styles.loadingContainer}
      >
        <LottieView
          source={require("../assets/lottie/loading.json")}
          autoPlay
          loop
          style={styles.lottie}
        />
        <Text style={styles.loadingText}>Loading Experience...</Text>
      </Animatable.View>

      <Animatable.Text
        animation="fadeIn"
        duration={1000}
        delay={1000}
        style={styles.footerText}
      >
        By: Umair Dada
      </Animatable.Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  circle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(79, 211, 218, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "rgba(79, 211, 218, 0.3)",
  },
  title: {
    fontSize: 36,
    fontWeight: "700",
    color: "#FFF",
    marginTop: 20,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 10,
  },
  loadingContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  lottie: {
    width: 100,
    height: 100,
  },
  loadingText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    marginTop: 10,
  },
  footerText: {
    position: "absolute",
    bottom: 30,
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 14,
  },
});

export default SplashScreen;
