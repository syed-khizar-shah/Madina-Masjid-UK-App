import Constants from 'expo-constants';

// Get the local IP address from Expo development server
const getLocalHost = () => {
  const debuggerHost = Constants.expoConfig?.hostUri;
  const localhost = debuggerHost?.split(':')[0] || 'localhost';
  return localhost;
};

export const base_url ='https://madina-masjid-uk.vercel.app/api';