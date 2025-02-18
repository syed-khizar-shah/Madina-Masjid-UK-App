import React, { useState, useEffect, memo, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format, isAfter, isBefore, addDays, differenceInSeconds, parse } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';

// Types
interface PrayerTime {
  startTime: string;
  jamaatTime?: string;
}

interface PrayerTimes {
  fajr: PrayerTime;
  sunrise: string;
  zuhr: PrayerTime;
  asr: PrayerTime;
  maghrib: string;
  isha: PrayerTime;
}

interface NextPrayer {
  name: string;
  time: string;
  type: 'Start' | 'Jamaat' | 'Time';
}

interface TimeRemaining {
  hours: number;
  minutes: number;
  seconds: number;
}

// Helper Functions
const formatTimeUnit = (value: number): string => value.toString().padStart(2, '0');

const calculateNextPrayer = (
  prayerTimes: PrayerTimes | null,
  currentTime: Date
): {
  nextPrayer: NextPrayer | null;
  timeToNextPrayer: TimeRemaining | null;
} => {
  if (!prayerTimes) return { nextPrayer: null, timeToNextPrayer: null };

  const prayers = [
    {
      name: 'Fajr',
      startTime: prayerTimes.fajr.startTime,
      jamaatTime: prayerTimes.fajr.jamaatTime,
    },
    { name: 'Sunrise', time: prayerTimes.sunrise },
    {
      name: 'Zuhr',
      startTime: prayerTimes.zuhr.startTime,
      jamaatTime: prayerTimes.zuhr.jamaatTime,
    },
    {
      name: 'Asr',
      startTime: prayerTimes.asr.startTime,
      jamaatTime: prayerTimes.asr.jamaatTime,
    },
    { name: 'Maghrib', time: prayerTimes.maghrib },
    {
      name: 'Isha',
      startTime: prayerTimes.isha.startTime,
      jamaatTime: prayerTimes.isha.jamaatTime,
    },
  ];

  const currentTimeStr = format(currentTime, 'HH:mm');
  const currentTimeParsed = parse(currentTimeStr, 'HH:mm', currentTime);

  let nextPrayerInfo = null;
  for (const prayer of prayers) {
    if ('startTime' in prayer && prayer.jamaatTime) {
      const startTimeParsed = parse(prayer.startTime, 'HH:mm', currentTime);
      const jamaatTimeParsed = parse(prayer.jamaatTime, 'HH:mm', currentTime);
      if (isAfter(startTimeParsed, currentTimeParsed)) {
        nextPrayerInfo = { ...prayer, time: prayer.startTime, type: 'Start' as const };
        break;
      } else if (isAfter(jamaatTimeParsed, currentTimeParsed)) {
        nextPrayerInfo = { ...prayer, time: prayer.jamaatTime, type: 'Jamaat' as const };
        break;
      }
    } else if ('time' in prayer) {
      const timeParsed = parse(prayer.time, 'HH:mm', currentTime);
      if (isAfter(timeParsed, currentTimeParsed)) {
        nextPrayerInfo = { name: prayer.name, time: prayer.time, type: 'Time' as const };
        break;
      }
    }
  }

  if (!nextPrayerInfo) {
    nextPrayerInfo = {
      name: 'Fajr',
      time: prayerTimes.fajr.startTime,
      type: 'Start' as const,
    };
  }

  let targetTime = parse(nextPrayerInfo.time, 'HH:mm', currentTime);
  if (isBefore(targetTime, currentTime)) {
    targetTime = addDays(targetTime, 1);
  }

  const diffInSeconds = differenceInSeconds(targetTime, currentTime);
  const timeToNextPrayer = {
    hours: Math.floor(diffInSeconds / 3600),
    minutes: Math.floor((diffInSeconds % 3600) / 60),
    seconds: diffInSeconds % 60,
  };

  return { nextPrayer: nextPrayerInfo, timeToNextPrayer };
};

// Components
const TimeBox = memo(({ value, label }: { value: string; label: string }) => (
  <View className="h-24 w-24 items-center justify-center rounded-lg bg-primary p-4">
    <Text className="text-3xl font-bold text-white">{value}</Text>
    <Text className="mt-1 text-sm text-white/80">{label}</Text>
  </View>
));

const PrayerCard = memo(
  ({
    name,
    startTime,
    jamaatTime,
    isNext,
  }: {
    name: string;
    startTime: string;
    jamaatTime?: string;
    isNext?: boolean;
  }) => (
    <View
      className={`mb-4 rounded-xl bg-white p-6 shadow-sm ${isNext ? 'border-2 border-primary' : ''}`}>
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            {name === 'Sunrise' ? (
              <Ionicons name="sunny-outline" size={20} color="#1B3D54" />
            ) : name === 'Isha' ? (
              <Ionicons name="moon-outline" size={20} color="#1B3D54" />
            ) : (
              <Ionicons name="time-outline" size={20} color="#1B3D54" />
            )}
            <Text className="text-lg font-semibold text-text">{name}</Text>
          </View>
          <Text className="mt-2 text-accent">Starts: {startTime}</Text>
          {jamaatTime && (
            <Text className="mt-1 font-medium text-primary">Jamaat: {jamaatTime}</Text>
          )}
        </View>
        {isNext && (
          <View className="rounded-full bg-primary/10 px-3 py-1">
            <Text className="text-sm font-medium text-primary">Next</Text>
          </View>
        )}
      </View>
    </View>
  )
);

const LoadingSpinner = () => (
  <SafeAreaView className="flex-1 bg-background">
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size="large" color="#1B3D54" />
    </View>
  </SafeAreaView>
);

const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <SafeAreaView className="flex-1 bg-background">
    <View className="flex-1 items-center justify-center p-4">
      <Text className="mb-4 text-lg text-text">{message}</Text>
      <TouchableOpacity onPress={onRetry} className="rounded-lg bg-primary px-6 py-2">
        <Text className="font-medium text-white">Retry</Text>
      </TouchableOpacity>
    </View>
  </SafeAreaView>
);

// Main Component
const PrayerTimesDisplay = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextPrayer, setNextPrayer] = useState<NextPrayer | null>(null);
  const [timeToNextPrayer, setTimeToNextPrayer] = useState<TimeRemaining | null>(null);
  const navigation = useNavigation();

  const fetchPrayerTimes = useCallback(async () => {
    try {
      setLoading(true);
      // Simulated API call - replace with actual endpoint
      const data = {
        fajr: { startTime: '05:30', jamaatTime: '05:45' },
        sunrise: '06:45',
        zuhr: { startTime: '12:30', jamaatTime: '13:00' },
        asr: { startTime: '15:45', jamaatTime: '16:15' },
        maghrib: '18:30',
        isha: { startTime: '20:00', jamaatTime: '20:30' },
      };
      setPrayerTimes(data);
      setError(null);
    } catch (err) {
      setError('Failed to load prayer times');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrayerTimes();
  }, [fetchPrayerTimes]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (prayerTimes) {
      const { nextPrayer: np, timeToNextPrayer: ttp } = calculateNextPrayer(
        prayerTimes,
        currentTime
      );
      setNextPrayer(np);
      setTimeToNextPrayer(ttp);
    }
  }, [currentTime, prayerTimes]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} onRetry={fetchPrayerTimes} />;

  return (
    <SafeAreaView className="flex-1 -mt-16 bg-background">
      <ScrollView className="flex-1">
      <View className="bg-primary mb-2 flex-row items-center justify-between px-4 py-4">
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <View className="">
            <Text className="mb-2 text-center text-2xl font-bold text-white">Prayer Times</Text>
            <Text className="text-center text-white">
              {format(currentTime, 'EEEE, MMMM d, yyyy')}
            </Text>
          </View>
        <View style={{ width: 28 }} /> {/* Placeholder for balanced spacing */}
      </View>


        <View className="mb-8 rounded-xl bg-white p-6 shadow-md mx-4">
          <View className="mb-6 items-center">
            <Text className="text-4xl font-bold text-text">{format(currentTime, 'HH:mm:ss')}</Text>
          </View>

          {nextPrayer && timeToNextPrayer && (
            <View className="border-t border-gray-100 pt-6">
              <Text className="mb-4 text-center font-medium text-primary">
                Next Prayer: {nextPrayer.name} - {nextPrayer.time}
              </Text>
              <View className="flex-row justify-center gap-4">
                <TimeBox value={formatTimeUnit(timeToNextPrayer.hours)} label="Hours" />
                <TimeBox value={formatTimeUnit(timeToNextPrayer.minutes)} label="Minutes" />
                <TimeBox value={formatTimeUnit(timeToNextPrayer.seconds)} label="Seconds" />
              </View>
            </View>
          )}
        </View>

        {prayerTimes && (
          <View className="mb-8 mx-4">
            <PrayerCard
              name="Fajr"
              startTime={prayerTimes.fajr.startTime}
              jamaatTime={prayerTimes.fajr.jamaatTime}
              isNext={nextPrayer?.name === 'Fajr'}
            />
            <PrayerCard
              name="Sunrise"
              startTime={prayerTimes.sunrise}
              isNext={nextPrayer?.name === 'Sunrise'}
            />
            <PrayerCard
              name="Zuhr"
              startTime={prayerTimes.zuhr.startTime}
              jamaatTime={prayerTimes.zuhr.jamaatTime}
              isNext={nextPrayer?.name === 'Zuhr'}
            />
            <PrayerCard
              name="Asr"
              startTime={prayerTimes.asr.startTime}
              jamaatTime={prayerTimes.asr.jamaatTime}
              isNext={nextPrayer?.name === 'Asr'}
            />
            <PrayerCard
              name="Maghrib"
              startTime={prayerTimes.maghrib}
              isNext={nextPrayer?.name === 'Maghrib'}
            />
            <PrayerCard
              name="Isha"
              startTime={prayerTimes.isha.startTime}
              jamaatTime={prayerTimes.isha.jamaatTime}
              isNext={nextPrayer?.name === 'Isha'}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrayerTimesDisplay;
