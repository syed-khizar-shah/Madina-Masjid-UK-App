import React, { useState } from 'react';
import { Modal, Text, TouchableOpacity, View, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';

const InfoButton = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const openLink = async (url: string) => {
    await WebBrowser.openBrowserAsync(url);
  };

  return (
    <>
      <TouchableOpacity
        className={`items-center justify-center rounded-full bg-primary-light/80 shadow-lg absolute z-20 bottom-2 right-2 h-12 w-12`}
        onPress={() => setModalVisible(true)}
      >
        <FontAwesome name="info" size={22} color="#fff" />
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 px-6">
          <View className="bg-white rounded-xl p-6 w-full max-w-lg">
            {/* Modal Title */}
            <Text className="text-xl font-semibold mb-4 text-center">About Us</Text>

            {/* Updated App Description */}
            <Text className="text-base mb-4 text-gray-700 text-center">
              This app is a product of CloudSwish, designed to help you stay connected with your daily prayer times.
            </Text>
            <Text className="text-base mb-4 text-gray-700 text-center">
              If you need assistance or have any questions, feel free to reach out to us at any time. We're here to help!
            </Text>

            {/* Developer Section */}
            <View className="my-6">
              <Text className="text-sm text-gray-600 text-center">Developed by:</Text>

              {/* CloudSwish.com link */}
              <TouchableOpacity
                onPress={() => openLink('https://www.CloudSwish.com')}
                className="mt-2 mb-4"
              >
                <Text className="text-lg font-semibold text-primary text-center">
                  CloudSwish.com
                </Text>
              </TouchableOpacity>

              {/* Email link */}
              <TouchableOpacity onPress={() => openLink('mailto:cloudswish.cs@outlook.com')}>
                <Text className="text-base font-medium text-primary text-center">
                  cloudswish.cs@outlook.com
                </Text>
              </TouchableOpacity>
            </View>

            {/* Close Button */}
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="mt-6 self-center bg-primary px-6 py-2 rounded-lg"
            >
              <Text className="text-white font-semibold">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default InfoButton;
