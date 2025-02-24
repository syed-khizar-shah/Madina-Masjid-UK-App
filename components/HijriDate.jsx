import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { fetchHijriDate, fetchHijriMethods, fetchSettings } from 'libs/service';

const HijriDate = () => {
  const [hijriDate, setHijriDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);
        const [settings, methodsData] = await Promise.all([fetchSettings(), fetchHijriMethods()]);
        // console.log('settings', settings);

        if (settings.hijriMethod) {
          const date = await fetchHijriDate(
            settings.hijriMethod.methodId,
            settings.hijriMethod.adjustment
          );
          setHijriDate(date);

        //   console.log('date check', date);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    initialize();
  }, []);

  return (
    <View>
      <Text className="text-center text-base font-medium text-text-light">
        {hijriDate?.day} {hijriDate?.month.en} {hijriDate?.year} AH
      </Text>
    </View>
  );
};

export default HijriDate;
