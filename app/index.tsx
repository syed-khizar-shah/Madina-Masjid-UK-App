import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useNavigation, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useCallback } from 'react';
import { format, isAfter, isBefore, addDays, differenceInSeconds, parse } from 'date-fns';
import { base_url } from '../libs/base-url';
import axios from 'axios'; // For Hijri conversion
import moment from 'moment-hijri';
import DonationButton from 'components/DonationsButton';
import HijriDate from 'components/HijriDate';

// Types
interface PrayerTime {
  startTime: string;
  jamaatTime: string;
}

interface PrayerTimes {
  fajr: PrayerTime;
  sunrise: string;
  zuhr: PrayerTime;
  asr: PrayerTime;
  maghrib: string;
  isha: PrayerTime;
  hijriDate: string;
}

interface NewsItem {
  title: string;
  isPublished: boolean;
}

interface TimeRemaining {
  hours: number;
  minutes: number;
  seconds: number;
}

interface NextPrayer {
  name: string;
  time: string;
  type: 'Start' | 'Jamaat' | 'Time';
}

interface PrayerTimeRowProps {
  name: string;
  arabicName: string;
  icon: keyof typeof Ionicons.glyphMap;
  startTime: string;
  endTime?: string;
  isNext?: boolean;
  isLast?: boolean;
}

// Updated PrayerTimeRow component:
const PrayerTimeRow = ({
  name,
  arabicName,
  icon,
  startTime,
  endTime,
  isNext,
  isLast,
}: PrayerTimeRowProps) => (
  <View
    className={`flex-row items-center px-4 pb-2 pt-1 ${
      !isLast ? 'border-b border-text-light/20' : ''
    } ${isNext ? 'bg-primary/10' : ''}`}>
    <View className="flex-1 flex-row items-center">
      <Ionicons name={icon} size={24} color="#FFFFFF" className="opacity-90" />
      <View className="ml-4">
        <Text className="text-lg font-semibold text-text-light">{name}</Text>
        <Text className="text-sm text-text-light opacity-80">{arabicName}</Text>
      </View>
      {isNext && (
        <View className="ml-4 rounded-full bg-white px-2 py-1">
          <Text className="text-xs font-medium text-primary">Next</Text>
        </View>
      )}
    </View>
    <View className="flex-row items-center">
      {endTime ? (
        <>
          <View className="flex items-center">
            <Text className="text-xs text-text-light opacity-80">Start</Text>
            <Text className="mt-1 text-lg font-medium text-text-light">{startTime}</Text>
          </View>
          <View className="mx-3 h-[70%] border-l border-text-light/30" />
          <View className="flex items-center">
            <Text className="text-xs text-text-light opacity-80">Jamaat</Text>
            <Text className="mt-1 text-lg font-medium text-text-light">{endTime}</Text>
          </View>
        </>
      ) : (
        <View className="flex items-center">
          <Text className="text-xs text-text-light opacity-80">Time</Text>
          <Text className="mt-1 text-lg font-medium text-text-light">{startTime}</Text>
        </View>
      )}
    </View>
  </View>
);

// Prayer info definitions
const PRAYER_INFO = [
  {
    name: 'Fajr',
    arabicName: 'الفجر',
    icon: 'moon-outline' as const,
  },
  {
    name: 'Sunrise',
    arabicName: 'الشروق',
    icon: 'sunny-outline' as const,
  },
  {
    name: 'Zuhr',
    arabicName: 'الظهر',
    icon: 'sunny' as const,
  },
  {
    name: 'Asr',
    arabicName: 'العصر',
    icon: 'sunny-outline' as const,
  },
  {
    name: 'Maghrib',
    arabicName: 'المغرب',
    icon: 'partly-sunny-outline' as const,
  },
  {
    name: 'Isha',
    arabicName: 'العشاء',
    icon: 'moon-outline' as const,
  },
];

const calculateNextPrayer = (
  prayerTimes: PrayerTimes | null,
  currentTime: Date
): { nextPrayer: NextPrayer | null; timeToNextPrayer: TimeRemaining | null } => {
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
    { name: 'Asr', startTime: prayerTimes.asr.startTime, jamaatTime: prayerTimes.asr.jamaatTime },
    { name: 'Maghrib', time: prayerTimes.maghrib },
    {
      name: 'Isha',
      startTime: prayerTimes.isha.startTime,
      jamaatTime: prayerTimes.isha.jamaatTime,
    },
  ];

  const currentTimeStr = format(currentTime, 'HH:mm');
  const currentTimeParsed = parse(currentTimeStr, 'HH:mm', currentTime);

  let nextPrayerInfo: NextPrayer | null = null;

  for (const prayer of prayers) {
    if ('startTime' in prayer && prayer.jamaatTime) {
      const startTimeParsed = parse(prayer.startTime, 'HH:mm', currentTime);
      const jamaatTimeParsed = parse(prayer.jamaatTime, 'HH:mm', currentTime);
      if (isAfter(startTimeParsed, currentTimeParsed)) {
        nextPrayerInfo = { name: prayer.name, time: prayer.startTime, type: 'Start' };
        break;
      } else if (isAfter(jamaatTimeParsed, currentTimeParsed)) {
        nextPrayerInfo = { name: prayer.name, time: prayer.jamaatTime, type: 'Jamaat' };
        break;
      }
    } else if ('time' in prayer) {
      const timeParsed = parse(prayer.time, 'HH:mm', currentTime);
      if (isAfter(timeParsed, currentTimeParsed)) {
        nextPrayerInfo = { name: prayer.name, time: prayer.time, type: 'Time' };
        break;
      }
    }
  }

  if (!nextPrayerInfo) {
    nextPrayerInfo = {
      name: 'Fajr',
      time: prayerTimes.fajr.startTime,
      type: 'Start',
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

export default function MainScreen() {
  const navigation = useNavigation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [nextPrayer, setNextPrayer] = useState<NextPrayer | null>(null);
  const [timeToNextPrayer, setTimeToNextPrayer] = useState<TimeRemaining | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);

  const fetchPrayerTimes = useCallback(async () => {
    try {
      const response = await axios.get(
        `${base_url}/prayer-times/date?date=${format(new Date(), 'yyyy-MM-dd')}`
      );
      setPrayerTimes(response.data);
    } catch (err) {
      console.error('Error fetching prayer times:', err);
      setError('Failed to load prayer times');
    }
  }, []);

  const fetchNews = async () => {
    try {
      const response = await axios.get<NewsItem[]>(`${base_url}/news`);
      const publishedNews = response.data.filter((item) => item.isPublished);
      setNews(publishedNews);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Failed to load news');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.all([fetchPrayerTimes(), fetchNews()]);
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

  useEffect(() => {
    if (Array.isArray(news) && news.length > 0) {
      const interval = setInterval(() => {
        setCurrentNewsIndex((prev) => (prev + 1) % news.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [news]);

  const NewsBanner = () => {
    if (!Array.isArray(news) || news.length === 0) return null;

    return (
      <TouchableOpacity className="mx-4 rounded-lg p-2.5" onPress={() => router.push('/news')}>
        <Text className="text-sm font-medium text-white">
          News: {news[currentNewsIndex]?.title || 'Loading news...'}
        </Text>
      </TouchableOpacity>
    );
  };

  // Format Hijri dates using moment-hijri
  const hijriDateEn = moment(new Date()).locale('en').format('iD iMMMM iYYYY');
  const hijriDateAr = moment(new Date()).locale('ar').format('iD iMMMM iYYYY');

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background-dark">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="white" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex-1 bg-primary-light mb-4"
      style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
      <View className="flex-1">
        {/* Header */}
        <View className="pb-2">
          <View className="shadw-md flex-row items-center justify-between bg-primary-light/95 py-2">
            <TouchableOpacity
              className="ml-4"
              onPress={() => {
                // @ts-ignore
                navigation.openDrawer();
              }}>
              <Ionicons name="menu" size={24} color="white" />
            </TouchableOpacity>
            <NewsBanner />
          </View>

          {/* Logo */}
          <View className="mt-4 items-center">
            <Image
              source={require('../assets/logo/logo.png')}
              className="h-18 w-44"
              resizeMode="contain"
            />
          </View>

          {/* Date & Hijri Date */}
          <View className="mt-1">
            <Text className="text-center text-base font-medium text-text-light">
              {format(currentTime, 'EEEE dd MMMM yyyy')}
            </Text>
            {/* <Text className="text-center text-base font-medium text-text-light">{hijriDateEn}</Text>
            <Text className="mt-0.5 text-center text-sm text-text-light opacity-90">
              {hijriDateAr}
            </Text> */}
            <HijriDate />
          </View>
        </View>

        {/* Next Prayer Time */}
        {nextPrayer && timeToNextPrayer && (
          <View className="mx-4 mt-1 bg-transparent">
            <Text className="py-3 text-center text-2xl font-semibold text-text-light">
              {PRAYER_INFO.find((p) => p.name === nextPrayer.name)?.arabicName || nextPrayer.name}{' '}
              {nextPrayer.type === 'Jamaat' ? 'Jamaat' : 'Start'}
            </Text>
            <Text className="text-center text-5xl font-bold text-text-light">
              {nextPrayer.time}
            </Text>
            <Text className="mt-1 text-center text-xl text-text-light opacity-90">
              {timeToNextPrayer.hours}h {timeToNextPrayer.minutes}m
            </Text>
          </View>
        )}

        {/* Prayer Times Container */}
        <View className="mx-4 mt-2 overflow-hidden rounded-xl bg-primary-dark/95 py-4 shadow-lg">
          {prayerTimes &&
            PRAYER_INFO.map((prayer, index) => (
              <PrayerTimeRow
                key={prayer.name}
                name={prayer.name}
                arabicName={prayer.arabicName}
                icon={prayer.icon}
                startTime={
                  prayer.name === 'Sunrise' || prayer.name === 'Maghrib'
                    ? (prayerTimes[prayer.name.toLowerCase() as keyof PrayerTimes] as string)
                    : (prayerTimes[prayer.name.toLowerCase() as keyof PrayerTimes] as PrayerTime)
                        .startTime
                }
                endTime={
                  prayer.name !== 'Sunrise' && prayer.name !== 'Maghrib'
                    ? (prayerTimes[prayer.name.toLowerCase() as keyof PrayerTimes] as PrayerTime)
                        .jamaatTime
                    : undefined
                }
                isNext={nextPrayer?.name === prayer.name}
                isLast={index === PRAYER_INFO.length - 1}
              />
            ))}
        </View>
        <DonationButton />
      </View>
    </SafeAreaView>
  );
}
