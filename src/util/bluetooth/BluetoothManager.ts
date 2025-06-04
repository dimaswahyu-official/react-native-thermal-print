import { BluetoothManager } from '@ccdilan/react-native-bluetooth-escpos-printer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert, PermissionsAndroid} from 'react-native';

// Connect to Bluetooth device
export const connectBluetoothDevice = async (device: any) => {
    try {

        const address = device.address;  // Ensure the address is valid
        if (!address) {
            throw new Error("Invalid device address.");
        }

        console.log(`Attempting to connect to device at address: ${address}`);
        await BluetoothManager.connect(address); // Connect to the Bluetooth device
        await AsyncStorage.setItem('connectedDeviceAddress', address); // Save the connected address
        console.log(`Connected to ${device.name}`);
        return address;
    } catch (error: any) {
        console.error('Failed to connect to the device:', error);
        Alert.alert("Error", "Failed to connect to the printer. Please ensure the device is powered on and in range.");
        throw new Error('Failed to connect to the printer.');
    }
};

// export const requestBluetoothPermissions = async () => {
//   try {
//     // Request BLUETOOTH_CONNECT and BLUETOOTH_SCAN permissions
//     const grantedConnect = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
//       {
//         title: "Bluetooth Permission",
//         message: "This app needs access to Bluetooth to scan and connect to devices.",
//         buttonPositive: "OK",
//         buttonNegative: "Cancel",
//       }
//     );
//
//     const grantedScan = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
//       {
//         title: "Bluetooth Scan Permission",
//         message: "This app needs access to scan Bluetooth devices.",
//         buttonPositive: "OK",
//         buttonNegative: "Cancel",
//       }
//     );
//
//     if (grantedConnect === PermissionsAndroid.RESULTS.GRANTED && grantedScan === PermissionsAndroid.RESULTS.GRANTED) {
//       console.log("Bluetooth permissions granted");
//     } else {
//       console.log("Bluetooth permissions denied");
//       Alert.alert('Bluetooth Permission Denied', 'The app cannot scan or connect to Bluetooth devices.');
//     }
//   } catch (err) {
//     console.warn(err);
//   }
// };


// Disconnect from Bluetooth device
export const disconnectBluetoothDevice = async () => {
    try {
        const deviceAddress = await AsyncStorage.getItem('connectedDeviceAddress');
        if (!deviceAddress) {
            throw new Error("No device address stored.");
        }
        await BluetoothManager.disconnect(deviceAddress);
        await AsyncStorage.removeItem('connectedDeviceAddress');

        console.log('Disconnected from printer');
        return null;
    } catch (error) {
        console.error('Error disconnecting:', error);
        throw new Error('Failed to disconnect from printer.');
    }
};

// Get saved Bluetooth device address from AsyncStorage
export const getSavedDeviceAddress = async () => {
    return await AsyncStorage.getItem('connectedDeviceAddress');
};

// Start Bluetooth scan for available devices
export const startBluetoothScan = async () => {
    try {
        const rawDevices = await BluetoothManager.enableBluetooth();
        const parsedDevices = rawDevices.map((item: any) => JSON.parse(item));
        console.log("Available devices:", parsedDevices);  // Debugging line to check available devices
        return parsedDevices;
    } catch (error) {
        console.error('Bluetooth scan error:', error);
        throw new Error('Bluetooth scan failed.');
    }
};
