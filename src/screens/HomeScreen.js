import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import Swiper from "react-native-swiper";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

import onboarding_img_1 from "../assets/images/onboarding/slide-1.png";
import onboarding_img_2 from "../assets/images/onboarding/slide-2.png";
import onboarding_img_3 from "../assets/images/onboarding/slide-3.png";
import onboarding_img_4 from "../assets/images/onboarding/welcome.png";

const { width, height } = Dimensions.get("window");

const slides = [
  {
    id: 1,
    image: onboarding_img_1,
    title: "Discover Amazing Destinations",
    description:
      "Explore the world's most beautiful places with our curated selection of travel destinations.",
    icon: "location",
  },
  {
    id: 2,
    image: onboarding_img_2,
    title: "Easy Flight Booking",
    description:
      "Book your flights in just a few taps with our intuitive booking system.",
    icon: "airplane",
  },
  {
    id: 3,
    image: onboarding_img_3,
    title: "Personalized Experience",
    description:
      "Get recommendations tailored to your travel preferences and style.",
    icon: "heart",
  },
  {
    id: 4,
    image: onboarding_img_4,
    title: "Ready to Explore?",
    description:
      "Start your journey with us and experience travel like never before.",
    icon: "rocket",
  },
];

const HomeScreen = ({ navigation }) => {
  const swiperRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleSkip = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      swiperRef.current.scrollBy(slides.length - 1 - currentIndex);
      fadeAnim.setValue(1);
    });
  };

  const handleGetStarted = () => {
    navigation.navigate("SearchFlightsScreen");
  };

  return (
    <LinearGradient
      colors={["#0F2027", "#203A43", "#2C5364"]}
      style={styles.container}
    >
      <Swiper
        ref={swiperRef}
        loop={false}
        showsPagination={false}
        onIndexChanged={(index) => setCurrentIndex(index)}
      >
        {slides.map((slide, index) => (
          <View style={styles.slide} key={slide.id}>
            <Image source={slide.image} style={styles.image} />
            <LinearGradient
              colors={["rgba(15, 32, 39, 0.8)", "rgba(15, 32, 39, 0.4)"]}
              style={styles.overlay}
            />

            <View style={styles.content}>
              <Animatable.View
                animation="fadeInDown"
                duration={800}
                style={styles.iconContainer}
              >
                <Ionicons
                  name={slide.icon}
                  size={40}
                  color="#4FD3DA"
                  style={styles.icon}
                />
              </Animatable.View>

              <Animatable.View animation="fadeInUp" duration={800} delay={200}>
                <Text style={styles.title}>{slide.title}</Text>
                <Text style={styles.description}>{slide.description}</Text>
              </Animatable.View>

              {index === slides.length - 1 && (
                <Animatable.View
                  animation="fadeInUp"
                  duration={800}
                  delay={400}
                  style={styles.finalButtons}
                >
                  <TouchableOpacity
                    style={styles.getStartedButton}
                    onPress={handleGetStarted}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.buttonText}>Get Started</Text>
                    <Ionicons name="arrow-forward" size={20} color="#FFF" />
                  </TouchableOpacity>
                </Animatable.View>
              )}
            </View>
          </View>
        ))}
      </Swiper>

      {/* Custom Pagination */}
      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === currentIndex && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>

      {/* Skip Button */}
      {currentIndex !== slides.length - 1 && (
        <Animated.View style={[styles.bottomBar, { opacity: fadeAnim }]}>
          <TouchableOpacity
            onPress={handleSkip}
            style={styles.skipButton}
            activeOpacity={0.7}
          >
            <Text style={styles.skipText}>Skip</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFF" />
          </TouchableOpacity>
        </Animated.View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    width,
    height,
    position: "relative",
  },
  image: {
    width,
    height,
    position: "absolute",
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingBottom: 120,
  },
  iconContainer: {
    backgroundColor: "rgba(79, 211, 218, 0.2)",
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 20,
    textAlign: "center",
    lineHeight: 36,
  },
  description: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  pagination: {
    position: "absolute",
    bottom: 100,
    flexDirection: "row",
    alignSelf: "center",
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginHorizontal: 5,
  },
  paginationDotActive: {
    width: 20,
    backgroundColor: "#4FD3DA",
  },
  bottomBar: {
    position: "absolute",
    bottom: 40,
    right: 30,
  },
  skipButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  skipText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "500",
    marginRight: 5,
  },
  finalButtons: {
    marginTop: 50,
    width: "100%",
    alignItems: "center",
  },
  getStartedButton: {
    backgroundColor: "#4FD3DA",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#4FD3DA",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
    marginRight: 10,
  },
});

export default HomeScreen;
