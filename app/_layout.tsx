import { Drawer } from 'expo-router/drawer';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import '../global.css';
import { SafeAreaView, StatusBar } from 'react-native';
import CloudswishLogo from 'components/CloudSwishLogo';
import { Platform } from 'react-native';

export default function Layout() {
  const [fontsLoaded] = useFonts({
    Roboto: require('../assets/fonts/Roboto-Regular.ttf'),
    'Roboto-Medium': require('../assets/fonts/Roboto-Medium.ttf'),
    'Roboto-Bold': require('../assets/fonts/Roboto-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
     <StatusBar
        barStyle={Platform.OS === 'android' ? 'light-content' : 'default'} // Keep default for iOS
        backgroundColor={Platform.OS === 'android' ? '#000' : 'transparent'} // Ensure visibility on Android
      />
      <Drawer
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            backgroundColor: '#F8FAFC', // background.DEFAULT from Tailwind config
            paddingTop:Platform.OS === "android" ? 20 : 0
          },
          drawerItemStyle:{
            marginVertical:Platform.OS === "android" ? 2 : 0,
          },
          drawerActiveBackgroundColor: '#42B0ED', // accent.DEFAULT from Tailwind config
          drawerActiveTintColor: '#FFFFFF', // text.light from Tailwind config
          drawerInactiveTintColor: '#2D3748', // text.DEFAULT from Tailwind config
        }}>
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: 'Prayer Times',
            drawerIcon: ({ color }) => <Ionicons name="time-outline" size={22} color={color} />,
          }}
        />
        <Drawer.Screen
          name="calendar"
          options={{
            drawerLabel: 'Calendar',
            drawerIcon: ({ color }) => <Ionicons name="calendar-outline" size={22} color={color} />,
          }}
        />
        <Drawer.Screen
          name="PrayersClock"
          options={{
            drawerLabel: 'Prayers Clock',
            drawerIcon: ({ color }) => <Ionicons name="time-outline" size={22} color={color} />,
          }}
        />
        <Drawer.Screen
          name="news"
          options={{
            drawerLabel: 'News',
            drawerIcon: ({ color }) => (
              <MaterialCommunityIcons name="newspaper" size={22} color={color} />
            ),
          }}
        />
      </Drawer>
      <CloudswishLogo />
    </SafeAreaView>
  );
}
