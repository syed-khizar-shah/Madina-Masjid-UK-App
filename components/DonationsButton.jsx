import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const DonationsButton = () => {
  return (
    <View className="absolute top-1/2 right-4 p-1 z-50 transform -translate-y-1/2">
    <TouchableOpacity
      className="items-center justify-center rounded-full bg-text-light p-3 shadow-lg"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}>
      <View className="flex items-center">
        <FontAwesome5 name="hand-holding-heart" size={28} color="#1B3D54" />
        <Text className="mt-1 text-center font-medium text-primary-dark">
          Donations
        </Text>
      </View>
    </TouchableOpacity>
  </View>
  )
}

export default DonationsButton