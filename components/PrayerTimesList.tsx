import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { parse, format, eachDayOfInterval, isValid, isFriday } from 'date-fns';

export interface PrayerTime {
  date: string;
  isRamadan?: boolean;
  ramadan?: {
    sehriEnds?: string;
    iftarTime?: string;
    taraweeh?: string;
  };
  fajr?: {
    startTime?: string;
    jamaatTime?: string;
  };
  sunrise?: string;
  zawal?: string;
  zuhr?: {
    startTime?: string;
    jamaatTime?: string;
  };
  asr?: {
    startTime?: string;
    jamaatTime?: string;
  };
  maghrib?: string;
  isha?: {
    startTime?: string;
    jamaatTime?: string;
  };
}

interface PrayerTimesListProps {
  prayerTimes: PrayerTime[];
}

function PrayerTimesList({ prayerTimes }: PrayerTimesListProps) {
  const [prayerTimesByDate, setPrayerTimesByDate] = useState<Record<string, PrayerTime>>({});
  const [daysInRange, setDaysInRange] = useState<Date[]>([]);
  const [hasRamadanData, setHasRamadanData] = useState(false);

  useEffect(() => {
    if (!prayerTimes || prayerTimes.length === 0) {
      setPrayerTimesByDate({});
      setDaysInRange([]);
      setHasRamadanData(false);
      return;
    }

    // Check if any entry contains Ramadan data
    const ramadanDataExists = prayerTimes.some(pt => pt.isRamadan && pt.ramadan);
    setHasRamadanData(ramadanDataExists);

    // Map prayer times by their date (formatted as "yyyy-MM-dd")
    const timesByDate = prayerTimes.reduce((acc, entry) => {
      try {
        const dateStr = entry.date.split('T')[0];
        const date = parse(dateStr, "yyyy-MM-dd", new Date());
        if (isValid(date)) {
          acc[format(date, "yyyy-MM-dd")] = entry;
        }
      } catch (err) {
        console.warn(`Invalid date format for entry: ${entry.date}`);
      }
      return acc;
    }, {} as Record<string, PrayerTime>);

    // Get all valid dates from the data
    const dates = prayerTimes
      .map(pt => parse(pt.date.split('T')[0], "yyyy-MM-dd", new Date()))
      .filter(date => isValid(date));

    // Determine the overall date range from the data
    const startDate = dates.reduce((a, b) => a < b ? a : b);
    const endDate = dates.reduce((a, b) => a > b ? a : b);

    // Create an array for each day in the interval
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    setPrayerTimesByDate(timesByDate);
    setDaysInRange(days);
  }, [prayerTimes]);

  if (!prayerTimes || prayerTimes.length === 0) {
    return (
      <View className="w-full py-8">
        <Text className="text-center text-white">
          No prayer times data to show
        </Text>
      </View>
    );
  }

  return (
    <ScrollView horizontal className="w-full">
      <View>
        {/* Table Header */}
        <View className="flex-row bg-gray-100">
          <View className="p-2 border w-24">
            <Text className="font-bold">Date</Text>
          </View>
          <View className="p-2 border w-24">
            <Text className="font-bold">Day</Text>
          </View>
          {hasRamadanData && (
            <View className="p-2 border w-24">
              <Text className="font-bold">Sehri Ends</Text>
            </View>
          )}
          <View className="p-2 border w-32">
            <Text className="font-bold text-center">Fajr</Text>
            <View className="flex-row justify-between mt-1">
              <Text className="text-xs">Start</Text>
              <Text className="text-xs">Jamaat</Text>
            </View>
          </View>
          <View className="p-2 border w-24">
            <Text className="font-bold">Sunrise</Text>
          </View>
          <View className="p-2 border w-24">
            <Text className="font-bold">Zawal</Text>
          </View>
          <View className="p-2 border w-32">
            <Text className="font-bold text-center">Zuhr</Text>
            <View className="flex-row justify-between mt-1">
              <Text className="text-xs">Start</Text>
              <Text className="text-xs">Jamaat</Text>
            </View>
          </View>
          <View className="p-2 border w-32">
            <Text className="font-bold text-center">Asr</Text>
            <View className="flex-row justify-between mt-1">
              <Text className="text-xs">Start</Text>
              <Text className="text-xs">Jamaat</Text>
            </View>
          </View>
          <View className="p-2 border w-24">
            <Text className="font-bold">Maghrib</Text>
          </View>
          {hasRamadanData && (
            <View className="p-2 border w-24">
              <Text className="font-bold">Iftar</Text>
            </View>
          )}
          <View className="p-2 border w-32">
            <Text className="font-bold text-center">Isha</Text>
            <View className="flex-row justify-between mt-1">
              <Text className="text-xs">Start</Text>
              <Text className="text-xs">Jamaat</Text>
            </View>
          </View>
          {hasRamadanData && (
            <View className="p-2 border w-24">
              <Text className="font-bold">Taraweeh</Text>
            </View>
          )}
        </View>

        {/* Table Body */}
        {daysInRange.map(date => {
          const dateStr = format(date, "yyyy-MM-dd");
          const prayerTime = prayerTimesByDate[dateStr];
          // Highlight Fridays and Ramadan days with different background colors
          const rowStyle = `flex-row ${isFriday(date) ? "bg-yellow-50" : ""} ${prayerTime?.isRamadan ? "bg-green-50" : ""}`;
          
          return (
            <View key={dateStr} className={rowStyle}>
              <View className="p-2 border w-24">
                <Text className="text-sm">{format(date, "dd MMM yyyy")}</Text>
              </View>
              <View className="p-2 border w-24">
                <Text className="text-sm">{format(date, "EEEE")}</Text>
              </View>
              {hasRamadanData && (
                <View className="p-2 border w-24">
                  <Text className="text-sm">{prayerTime?.ramadan?.sehriEnds || 'N/A'}</Text>
                </View>
              )}
              <View className="p-2 border w-32">
                <View className="flex-row justify-between">
                  <Text className="text-sm">{prayerTime?.fajr?.startTime || 'N/A'}</Text>
                  <Text className="text-sm">{prayerTime?.fajr?.jamaatTime || 'N/A'}</Text>
                </View>
              </View>
              <View className="p-2 border w-24">
                <Text className="text-sm">{prayerTime?.sunrise || 'N/A'}</Text>
              </View>
              <View className="p-2 border w-24">
                <Text className="text-sm">{prayerTime?.zawal || 'N/A'}</Text>
              </View>
              <View className="p-2 border w-32">
                <View className="flex-row justify-between">
                  <Text className="text-sm">{prayerTime?.zuhr?.startTime || 'N/A'}</Text>
                  <Text className="text-sm">{prayerTime?.zuhr?.jamaatTime || 'N/A'}</Text>
                </View>
              </View>
              <View className="p-2 border w-32">
                <View className="flex-row justify-between">
                  <Text className="text-sm">{prayerTime?.asr?.startTime || 'N/A'}</Text>
                  <Text className="text-sm">{prayerTime?.asr?.jamaatTime || 'N/A'}</Text>
                </View>
              </View>
              <View className="p-2 border w-24">
                <Text className="text-sm">{prayerTime?.maghrib || 'N/A'}</Text>
              </View>
              {hasRamadanData && (
                <View className="p-2 border w-24">
                  <Text className="text-sm">{prayerTime?.ramadan?.iftarTime || 'N/A'}</Text>
                </View>
              )}
              <View className="p-2 border w-32">
                <View className="flex-row justify-between">
                  <Text className="text-sm">{prayerTime?.isha?.startTime || 'N/A'}</Text>
                  <Text className="text-sm">{prayerTime?.isha?.jamaatTime || 'N/A'}</Text>
                </View>
              </View>
              {hasRamadanData && (
                <View className="p-2 border w-24">
                  <Text className="text-sm">{prayerTime?.ramadan?.taraweeh || 'N/A'}</Text>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

export default PrayerTimesList;
