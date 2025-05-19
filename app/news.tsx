import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Platform,
  ImageBackground,
} from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import axios from 'axios';
import { useWindowDimensions } from 'react-native';
import { base_url } from '../libs/base-url';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface NewsItem {
  _id: string;
  title: string;
  content: string;
  image?: {
    publicId: string;
    url: string;
  };
  category: 'general' | 'announcement' | 'event';
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function NewsScreen() {
  const router = useRouter();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { width } = useWindowDimensions();
  const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({});
  const navigation = useNavigation();

  // Determine if device is tablet based on width
  const isTablet = width >= 768;

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setError(null);
      console.log('Fetching from:', `${base_url}/news`);

      const response = await axios.get<NewsItem[]>(`${base_url}/news`, {
        timeout: 10000, // 10 second timeout
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      // Filter only published news
      const publishedNews = response.data.filter((item: NewsItem) => item.isPublished);
      setNews(publishedNews);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', {
          message: error.message,
          code: error.code,
          response: error.response?.data,
        });
        setError(`Network error: ${error.message}`);
      } else {
        console.error('Error fetching news:', error);
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#3B82F6" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background px-4 py-3.5">
        <Text className="mb-4 text-lg text-muted">{error}</Text>
        <TouchableOpacity className="rounded-lg bg-primary px-4 py-2" onPress={fetchNews}>
          <Text className="text-white">Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
        <ImageBackground
          source={require("../assets/bg-blue-pattern.jpg")}
          resizeMode="cover"
          className="flex-1"
        >
    <SafeAreaView className="flex-1">
      {/* Custom Header */}
      <View className={`bg-primary-light/50 flex-row items-center justify-between px-4 ${Platform.OS==="android"?"mt-0 py-3":"-mt-16 py-4"}`}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={Platform.OS==='android'?24:28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-white">News</Text>
        <View style={{ width: 28 }} />
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className={`p-4 mb-10 ${isTablet ? 'mx-auto max-w-4xl' : ''}`}>
          {news.map((item) => (
            <TouchableOpacity key={item._id} activeOpacity={0.8}>
              <View className="mb-6 overflow-hidden rounded-2xl bg-white shadow-lg">
                {item.image?.url && (
                  <Image
                    source={{ uri: item.image.url }}
                    className="h-40 w-full"
                    resizeMode="cover"
                  />
                )}
                <View className="p-4">
                  <View className="mb-2 flex-row items-center">
                    <Text className="mr-2 text-xs font-medium text-primary">
                      {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                    </Text>
                    <Text className="text-xs text-muted">
                      {format(new Date(item.updatedAt), 'EEEE, do MMMM')}
                    </Text>
                  </View>
                  <Text className="mb-2 text-lg font-bold text-text">{item.title}</Text>
                  {item.content && (
                    <View>
                      <Text
                        numberOfLines={expandedItems[item._id] ? undefined : 3}
                        className="text-base text-text">
                        {item.content}
                      </Text>
                      {item.content.length > 150 && (
                        <TouchableOpacity
                          onPress={(e) => {
                            e.stopPropagation();
                            toggleExpand(item._id);
                          }}
                          className="mt-2 flex-row items-center">
                          <Text className="mr-1 text-accent text-sm">
                            {expandedItems[item._id] ? 'Show less' : 'Read more'}
                          </Text>
                          <Ionicons
                            name={expandedItems[item._id] ? 'chevron-up' : 'chevron-down'}
                            size={16}
                            color="#3B82F6"
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
    </ImageBackground>
  );
}
