import { Link } from 'expo-router';
import React from 'react';
import { View, Text, Image } from 'react-native';

const CloudswishLogo = () => {
  return (
    <View className="absolute bottom-0 left-0 right-0 z-10 flex-row items-center justify-center bg-white bg-opacity-50 pt-2 pb-6">
      <Link href="https://www.cloudswish.com">
        <Text className="mr-2 text-sm text-black">
          Developed by CloudSwish.com
        </Text>
      </Link>
      <Image
        source={require('../assets/cloudswish-logo/cloudswish.jpg')} // adjust the path as needed
        className="h-6 w-20 rounded-full"
        resizeMode="contain"
      />
    </View>
  );
};

export default CloudswishLogo;
