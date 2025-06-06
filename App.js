// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/screens/HomeScreen";
import FlightListScreen from "./src/screens/FlightListScreen";
import FlightDetailsScreen from "./src/screens/FlightDetailsScreen";
import BookingScreen from "./src/screens/BookingScreen";
import ConfirmationScreen from "./src/screens/ConfirmationScreen";
import SearchFlightsScreen from "./src/screens/SearchFlightsScreen";
import PaymentPage from "./src/screens/PaymentPage";
import PaymentConfirmation from "./src/screens/PaymentConfirmation";
import MenuScreen from "./src/screens/MenuScreen";
import ViewBookingScreen from "./src/screens/ViewBookingScreen";
import CancelBookingScreen from "./src/screens/CancelBookingScreen";
import CheckInScreen from "./src/screens/CheckInScreen";
import SplashScreen from "./src/screens/SplashScreen";
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="SplashScreen"
      >
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          screenOptions={{ headerShown: false }}
        />

        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Flights" component={FlightListScreen} />
        <Stack.Screen name="FlightDetails" component={FlightDetailsScreen} />
        <Stack.Screen name="Booking" component={BookingScreen} />
        <Stack.Screen name="Confirmation" component={ConfirmationScreen} />
        <Stack.Screen name="MenuScreen" component={MenuScreen} />
        <Stack.Screen name="ViewBookingScreen" component={ViewBookingScreen} />
        <Stack.Screen name="CheckInScreen" component={CheckInScreen} />
        <Stack.Screen
          name="CancelBookingScreen"
          component={CancelBookingScreen}
        />
        <Stack.Screen
          name="SearchFlightsScreen"
          component={SearchFlightsScreen}
        />
        <Stack.Screen name="PaymentPage" component={PaymentPage} />
        <Stack.Screen
          name="PaymentConfirmation"
          component={PaymentConfirmation}
        />
        {/* Add PaymentPage to the stack */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
