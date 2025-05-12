import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { FontAwesome5 } from '@expo/vector-icons';

const DonationButton = () => {
  return (
    <>
      <TouchableOpacity
        className={`items-center justify-center rounded-full bg-text-light p-3 shadow-lg absolute top-60 left-8
           ${Platform.OS==="android"?"h-20 w-20":"h-24 w-24" }`}
        onPress={() =>WebBrowser.openBrowserAsync('https://www.madinamasjidukim.org/donation/')}>
        <View className="flex items-center">
          <FontAwesome5 name="hand-holding-heart" size={28} color="#42B0ED" />
          <Text className="mt-1 text-center text-[10px] font-medium text-primary-dark">Donate</Text>
        </View>
      </TouchableOpacity>
    </>
  );
};

export default DonationButton;
// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Modal,
//   TextInput,
//   ScrollView,
//   ActivityIndicator,
//   KeyboardAvoidingView,
//   Platform,
//   TouchableWithoutFeedback,
//   Keyboard,
// } from 'react-native';
// import * as WebBrowser from 'expo-web-browser';
// import { useSegments, useLocalSearchParams } from 'expo-router';
// import axios from 'axios';
// import { base_url } from '../libs/base-url';
// import { FontAwesome5 } from '@expo/vector-icons';

// const DonationButton = () => {
//   const segments = useSegments();
//   const params = useLocalSearchParams();

//   const [isModalVisible, setModalVisible] = useState(false);
//   const [amount, setAmount] = useState('');
//   const [customAmount, setCustomAmount] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [paymentSuccess,setPaymentSuccess] = useState(false);

//   // Predefined donation amounts
//   const donationAmounts = [5, 10, 15, 20, 25, 30, 35, 40];

//   useEffect(() => {
//     // Check if payment was successful in the URL parameters
//     if (segments[segments.length - 1] === 'success' && params.paymentId && params.PayerID) {
//       handlePaymentSuccess(params.paymentId, params.PayerID);
//     }
//   }, [segments, params]);

//   const handleDonation = async () => {
//     const donationAmount = amount === 'custom' ? customAmount : amount;

//     if (!donationAmount || isNaN(donationAmount) || parseFloat(donationAmount) <= 0) {
//       alert('Please enter a valid amount');
//       return;
//     }

//     setLoading(true);
//     try {
//       // Create payment
//       const response = await axios.post(`${base_url}/donation/create-payment`, {
//         amount: parseFloat(donationAmount),
//         appScheme: 'masjidapp',
//       });
//       console.log(response.data)

//       if (!response.data.approvalUrl) {
//         throw new Error('No approval URL received');
//       }

//       // Open PayPal in browser
//       try {
//         const result = await WebBrowser.openAuthSessionAsync(
//           response.data.approvalUrl,
//           'masjidapp:///?status=success',
//           {
//             showInRecents: true,
//           }
//         );

//         if (result.type === 'success' && result.url) {
//           // Extract query parameters manually
//           const urlParams = new URLSearchParams(result.url.split('?')[1]);
//           const paymentId = urlParams.get('paymentId');
//           const PayerID = urlParams.get('PayerID');
//           console.log({paymentId,PayerID})
//           if (paymentId && PayerID) {
//             handlePaymentSuccess(paymentId, PayerID);
//           } else {
//             alert('Payment details missing. Please try again.');
//           }
//         } else if (result.type === 'cancel') {
//           alert('Payment cancelled');
//         }
//       } catch (browserError) {
//         console.error('Browser error:', browserError);
//         // Fallback to regular browser if auth session fails
//         await WebBrowser.openBrowserAsync(response.data.approvalUrl);
//       }
//     } catch (error) {
//       console.error('Donation error:', error);
//       alert('Donation failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePaymentSuccess = async (paymentId, PayerID) => {
//     setIsProcessing(true);
//     try {
//       const captureResponse = await axios.post(`${base_url}/donation/execute-payment`, {
//         paymentId,
//         PayerID,
//       });

//       if (captureResponse.data.success) {
//         setPaymentSuccess(true);
//         console.log("here")
//         setModalVisible(false);
//         alert('Thank you for donation.');
//       } else {
//         alert('Payment failed. Please try again.');
//       }
//     } catch (error) {
//       console.error('Payment processing error:', error);
//       alert('Payment processing failed. Please try again.');
//     } finally {
//       setIsProcessing(false);

//       // Close modal after 2 seconds
//       setTimeout(() => {
//         setModalVisible(false);
//         setAmount('');
//         setCustomAmount('');
//       }, 2000);
//     }
//   };

//   const AmountButton = ({ value }) => (
//     <TouchableOpacity
//       className={`m-1 flex-1 rounded-lg p-3 ${amount === value ? 'bg-primary' : 'bg-gray-200'}`}
//       onPress={() => {
//         setAmount(value);
//         if (value !== 'custom') {
//           setCustomAmount('');
//         }
//       }}>
//       <Text className={`text-center text-lg ${amount === value ? 'text-white' : 'text-gray-700'}`}>
//         {value === 'custom' ? 'Custom' : `£${value}`}
//       </Text>
//     </TouchableOpacity>
//   );

//   const dismissKeyboard = () => {
//     Keyboard.dismiss();
//   };

//   return (
//     <>
//       <TouchableOpacity
//         className={`items-center justify-center rounded-full bg-text-light p-3 shadow-lg absolute top-60 left-8
//            ${Platform.OS==="android"?"h-20 w-20":"h-24 w-24" }`}
//         onPress={() => setModalVisible(true)}>
//         <View className="flex items-center">
//           <FontAwesome5 name="hand-holding-heart" size={28} color="#42B0ED" />
//           <Text className="mt-1 text-center text-[10px] font-medium text-primary-dark">Donate</Text>
//         </View>
//       </TouchableOpacity>

//       <Modal
//         visible={isModalVisible}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setModalVisible(false)}>
//         <TouchableWithoutFeedback onPress={dismissKeyboard}>
//           <KeyboardAvoidingView
//             behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//             className="flex-1 justify-center">
//             <View className="flex-1 justify-center bg-black/50">
//               <View className="mx-4 rounded-xl bg-white p-4 max-h-4/5">
//                 {isProcessing ? (
//                   <>
//                     <Text className="mb-4 text-center text-xl font-bold text-primary">
//                       Processing Your Donation...
//                     </Text>
//                     <ActivityIndicator size="large" color="#42B0ED" />
//                   </>
//                 ) : (
//                   <ScrollView contentContainerClassName="pb-4">
//                     <Text className="mb-4 text-center text-xl font-bold">Select Donation Amount</Text>

//                     <View className="flex-row flex-wrap justify-center">
//                       {donationAmounts.map((value) => (
//                         <View key={value} className="w-1/2 px-1">
//                           <AmountButton value={value} />
//                         </View>
//                       ))}
//                       <View className="w-1/2 px-1">
//                         <AmountButton value="custom" />
//                       </View>
//                     </View>

//                     {amount === 'custom' && (
//                       <TextInput
//                         className="mb-4 mt-4 rounded-lg border border-gray-300 p-3 text-center text-lg"
//                         keyboardType="numeric"
//                         placeholder="Enter amount in GBP"
//                         value={customAmount}
//                         onChangeText={setCustomAmount}
//                       />
//                     )}

//                     <TouchableOpacity
//                       className="mt-4 rounded-lg bg-primary p-4"
//                       onPress={handleDonation}
//                       disabled={loading}>
//                       <Text className="text-center text-lg font-bold text-white">
//                         {loading ? 'Processing...' : 'Donate to Madina Masjid'}
//                       </Text>
//                     </TouchableOpacity>

//                     <TouchableOpacity className="mt-2 p-2" onPress={() => setModalVisible(false)}>
//                       <Text className="text-center text-gray-600">Cancel</Text>
//                     </TouchableOpacity>
//                   </ScrollView>
//                 )}
//               </View>
//             </View>
//           </KeyboardAvoidingView>
//         </TouchableWithoutFeedback>
//       </Modal>
//     </>
//   );
// };

// export default DonationButton;
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------

// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Modal,
//   TextInput,
//   ScrollView,
//   ActivityIndicator,
// } from 'react-native';
// import * as WebBrowser from 'expo-web-browser';
// import { useSegments, useLocalSearchParams } from 'expo-router';
// import axios from 'axios';
// import { base_url } from '../libs/base-url';
// import { FontAwesome5 } from '@expo/vector-icons';

// const DonationButton = () => {
//   const segments = useSegments();
//   const params = useLocalSearchParams();

//   const [isModalVisible, setModalVisible] = useState(false);
//   const [amount, setAmount] = useState('');
//   const [customAmount, setCustomAmount] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [isProcessing, setIsProcessing] = useState(false); // New state to track payment processing

//   // Predefined donation amounts
//   const donationAmounts = [5, 10, 15, 20, 25, 30, 35, 40];

//   useEffect(() => {
//     // Check if payment was successful in the URL parameters
//     if (segments[segments.length - 1] === 'success' && params.paymentId && params.PayerID) {
//       handlePaymentSuccess(params.paymentId, params.PayerID);
//     }
//   }, [segments, params]);

//   const handleDonation = async () => {
//     const donationAmount = amount === 'custom' ? customAmount : amount;

//     if (!donationAmount || isNaN(donationAmount) || parseFloat(donationAmount) <= 0) {
//       alert('Please enter a valid amount');
//       return;
//     }

//     setLoading(true);
//     try {
//       // Create payment
//       const response = await axios.post(`${base_url}/donation/create-payment`, {
//         amount: parseFloat(donationAmount),
//         appScheme: 'masjidapp',
//       });

//       if (!response.data.approvalUrl) {
//         throw new Error('No approval URL received');
//       }

//       // Open PayPal in browser
//       try {
//         const result = await WebBrowser.openAuthSessionAsync(
//           response.data.approvalUrl,
//           'masjidapp://payment/success',
//           {
//             showInRecents: true,
//           }
//         );

//         if (result.type === 'success' && result.url) {
//           // Extract query parameters manually
//           const urlParams = new URLSearchParams(result.url.split('?')[1]);
//           const paymentId = urlParams.get('paymentId');
//           const PayerID = urlParams.get('PayerID');

//           if (paymentId && PayerID) {
//             handlePaymentSuccess(paymentId, PayerID);
//           } else {
//             alert('Payment details missing. Please try again.');
//           }
//         } else if (result.type === 'cancel') {
//           alert('Payment cancelled');
//         }
//       } catch (browserError) {
//         console.error('Browser error:', browserError);
//         // Fallback to regular browser if auth session fails
//         await WebBrowser.openBrowserAsync(response.data.approvalUrl);
//       }
//     } catch (error) {
//       console.error('Donation error:', error);
//       alert('Donation failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePaymentSuccess = async (paymentId, PayerID) => {
//     setIsProcessing(true);
//     try {
//       const captureResponse = await axios.post(`${base_url}/donation/execute-payment`, {
//         paymentId,
//         PayerID,
//       });

//       if (captureResponse.data.success) {
//         setModalVisible(false);
//         alert('Thank you for dontaion.');
//       } else {
//         alert('Payment failed. Please try again.');
//       }
//     } catch (error) {
//       console.error('Payment processing error:', error);
//       alert('Payment processing failed. Please try again.');
//     } finally {
//       setIsProcessing(false);

//       // Close modal after 2 seconds
//       setTimeout(() => {
//         setModalVisible(false);
//         setAmount('');
//         setCustomAmount('');
//       }, 2000);
//     }
//   };

//   const AmountButton = ({ value }) => (
//     <TouchableOpacity
//       className={`m-1 flex-1 rounded-lg p-3 ${amount === value ? 'bg-primary' : 'bg-gray-200'}`}
//       onPress={() => {
//         setAmount(value);
//         if (value !== 'custom') {
//           setCustomAmount('');
//         }
//       }}>
//       <Text className={`text-center text-lg ${amount === value ? 'text-white' : 'text-gray-700'}`}>
//         {value === 'custom' ? 'Custom' : `£${value}`}
//       </Text>
//     </TouchableOpacity>
//   );

//   return (
//     <>
//       <TouchableOpacity
//         className="items-center justify-center rounded-full bg-text-light p-3 shadow-lg h-24 w-24 absolute top-60 left-8"
//         onPress={() => setModalVisible(true)}>
//         <View className="flex items-center">
//           <FontAwesome5 name="hand-holding-heart" size={28} color="#42B0ED" />
//           <Text className="mt-1 text-center text-[10px] font-medium text-primary-dark">Donations</Text>
//         </View>
//       </TouchableOpacity>

//       <Modal
//         visible={isModalVisible}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setModalVisible(false)}>
//         <View className="flex-1 justify-center bg-black/50">
//           <View className="mx-4 rounded-xl bg-white p-4">
//             {isProcessing ? (
//               <>
//                 <Text className="mb-4 text-center text-xl font-bold text-primary">
//                   Processing Your Donation...
//                 </Text>
//                 <ActivityIndicator size="large" color="#42B0ED" />
//               </>
//             ) : (
//               <>
//                 <Text className="mb-4 text-center text-xl font-bold">Select Donation Amount</Text>

//                 <ScrollView>
//                   <View className="flex-row flex-wrap justify-center">
//                     {donationAmounts.map((value) => (
//                       <View key={value} className="w-1/2 px-1">
//                         <AmountButton value={value} />
//                       </View>
//                     ))}
//                     <View className="w-1/2 px-1">
//                       <AmountButton value="custom" />
//                     </View>
//                   </View>
//                 </ScrollView>

//                 {amount === 'custom' && (
//                   <TextInput
//                     className="mb-4 mt-4 rounded-lg border border-gray-300 p-3 text-center text-lg"
//                     keyboardType="numeric"
//                     placeholder="Enter amount in GBP"
//                     value={customAmount}
//                     onChangeText={setCustomAmount}
//                   />
//                 )}

//                 <TouchableOpacity
//                   className="mt-4 rounded-lg bg-primary p-4"
//                   onPress={handleDonation}
//                   disabled={loading}>
//                   <Text className="text-center text-lg font-bold text-white">
//                     {loading ? 'Processing...' : 'Donate to Madina Masjid'}
//                   </Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity className="mt-2 p-2" onPress={() => setModalVisible(false)}>
//                   <Text className="text-center text-gray-600">Cancel</Text>
//                 </TouchableOpacity>
//               </>
//             )}
//           </View>
//         </View>
//       </Modal>
//     </>
//   );
// };

// export default DonationButton;
