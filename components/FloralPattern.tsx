import { View } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';

export const FloralPattern = () => (
  <View className="absolute w-full h-full opacity-10">
    <Svg width="100%" height="100%" viewBox="0 0 100 100">
      <G>
        <Path
          d="M50 0C55.5 0 60 4.5 60 10C60 15.5 55.5 20 50 20C44.5 20 40 15.5 40 10C40 4.5 44.5 0 50 0Z"
          fill="white"
        />
        {/* Add more floral pattern paths here */}
        <Path
          d="M80 30C85.5 30 90 34.5 90 40C90 45.5 85.5 50 80 50C74.5 50 70 45.5 70 40C70 34.5 74.5 30 80 30Z"
          fill="white"
        />
      </G>
    </Svg>
  </View>
);