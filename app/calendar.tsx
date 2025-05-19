import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Platform, ImageBackground } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { format, parse, isValid, startOfMonth, endOfMonth, isFriday } from 'date-fns';
import { base_url } from '../libs/base-url';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrayerTimesList from '../components/PrayerTimesList';
import * as ScreenOrientation from 'expo-screen-orientation';

interface PrayerTime {
  date: string;
  isRamadan: boolean;
  fajr: {
    startTime: string;
    jamaatTime: string;
  };
  sunrise: string;
  zuhr: {
    startTime: string;
    jamaatTime: string;
  };
  asr: {
    startTime: string;
    jamaatTime: string;
  };
  maghrib: string;
  isha: {
    startTime: string;
    jamaatTime: string;
  };
  zawal: string;
  ramadan?: {
    taraweeh: string;
    sehriEnds: string;
    iftarTime: string;
  };
}

export default function CalendarScreen() {
  const router = useRouter();
  const [existingPrayerTimes, setExistingPrayerTimes] = useState<PrayerTime[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  // Generate next 12 months
  const months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() + i);
    return d;
  });

  const fetchPrayerTimesByMonth = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const start = format(startOfMonth(selectedMonth), 'yyyy-MM-dd');
      const end = format(endOfMonth(selectedMonth), 'yyyy-MM-dd');
      const response = await fetch(`${base_url}/prayer-times?start=${start}&end=${end}`);
      const data = await response.json();

      if (!data.prayerTimes) {
        throw new Error('No prayer times data received');
      }

      // Sort prayer times by date
      const sortedTimes = data.prayerTimes.sort(
        (a: PrayerTime, b: PrayerTime) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      setExistingPrayerTimes(sortedTimes);
    } catch (err: any) {
      setError('Error fetching prayer times: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrayerTimesByMonth();
  }, [selectedMonth]);

  useEffect(() => {
    // Allow both landscape and portrait
    ScreenOrientation.unlockAsync();
  }, []);

  return (
    <ImageBackground
          source={require("../assets/bg-blue-pattern.jpg")}
          resizeMode="cover"
          className="flex-1"
        >
    <SafeAreaView className="flex-1">
      {/* Custom Header */}
      <View className={`${Platform.OS==="android"?"mt-0":"-mt-16"} bg-primary-light/50 flex-row items-center justify-between px-4 py-3`}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={Platform.OS==='android'?24:28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-white">Prayer Times Calendar</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView className="flex-1">
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="py-4 px-4">
          {months.map((month) => (
            <TouchableOpacity
              key={month.toISOString()}
              className={`mr-3 rounded-xl px-6 py-3 ${
                month.getMonth() === selectedMonth.getMonth() 
                  ? 'bg-primary shadow-sm' 
                  : 'bg-white border border-gray-100'
              }`}
              onPress={() => setSelectedMonth(month)}>
              <Text
                className={`font-medium ${
                  month.getMonth() === selectedMonth.getMonth() 
                    ? 'text-white' 
                    : 'text-text'
                }`}>
                {format(month, 'MMMM yyyy')}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {error && (
          <View className="mb-4 mx-4 rounded-xl bg-red-50 p-4">
            <Text className="text-red-600">{error}</Text>
          </View>
        )}

        {isLoading ? (
          <View className="items-center justify-center py-12">
            <ActivityIndicator size="large" color="#3B82F6" />
          </View>
        ) : (
          <View className={`pb-6 mb-10 ${Platform.OS==="android" ? "my-5 mx-2" : ""}`}>
            <Text className="mb-4 px-4 text-lg font-bold text-white">
              Prayer Times for {format(selectedMonth, 'MMMM yyyy')}
            </Text>
            <PrayerTimesList prayerTimes={existingPrayerTimes} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
    </ImageBackground>
  );
}
