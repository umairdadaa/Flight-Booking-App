import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const HomeScreen = ({ navigation }) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,  // Hide the default header
    });
  }, [navigation]);

  return (
    <LinearGradient
      colors={['#16697A', '#489FB5']}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>Welcome to Your Luxurious Journey</Text>
      </View>

      {/* Image section */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: 'https://www.freeiconspng.com/uploads/plane-travel-flight-tourism-travel-icon-png-10.png' }}
          style={styles.image}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Find the Best Flights</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('SearchFlightsScreen')}
        >
          <Text style={styles.buttonText}>Start Booking</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Made by Umair Dada</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 150,
  },
  header: {
    alignItems: 'center',
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#EDE7E3',
    textAlign: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical:50,
  },
  image: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#EDE7E3',
    marginBottom: 30,
    marginTop: -150,
  },
  button: {
    backgroundColor: '#FFA62B',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#EDE7E3',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  footerText: {
    fontSize: 16,
    color: '#EDE7E3',
  },
});

export default HomeScreen;
