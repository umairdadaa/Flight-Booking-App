// src/screens/BookingScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import api from '../api';

export default function BookingScreen({ route, navigation }) {
  const { flightId } = route.params;
  const [passengers, setPassengers] = useState([{ full_name: '', passport_number: '' }]);
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [loading, setLoading] = useState(false);

  const handleAddPassenger = () => {
    setPassengers([...passengers, { full_name: '', passport_number: '' }]);
  };

  const handleBooking = async () => {
    setLoading(true);
    try {
      const response = await api.post('/book', { userId: 1, flightId, passengers, seatClassId: 1, paymentMethod });
      navigation.navigate('Confirmation', { bookingId: response.data.bookingId });
    } catch (error) {
      console.error('Error booking flight:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Booking Flight</Text>
      {passengers.map((passenger, index) => (
        <View key={index} style={styles.passengerForm}>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={passenger.full_name}
            onChangeText={(text) => {
              const newPassengers = [...passengers];
              newPassengers[index].full_name = text;
              setPassengers(newPassengers);
            }}
          />
          <TextInput
            style={styles.input}
            placeholder="Passport Number"
            value={passenger.passport_number}
            onChangeText={(text) => {
              const newPassengers = [...passengers];
              newPassengers[index].passport_number = text;
              setPassengers(newPassengers);
            }}
          />
        </View>
      ))}
      <Button title="Add Passenger" onPress={handleAddPassenger} />
      <TextInput
        style={styles.input}
        placeholder="Payment Method"
        value={paymentMethod}
        onChangeText={setPaymentMethod}
      />
      <Button title={loading ? "Booking..." : "Confirm Booking"} onPress={handleBooking} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  heading: { fontSize: 24, marginBottom: 20 },
  passengerForm: { marginBottom: 15 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
});
