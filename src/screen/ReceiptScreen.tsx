import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, Alert, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {Item, RootStackParamList} from '../../App.tsx';
import {useLoadingDialogStore} from '../store/useLoadingStore.ts';
import {
  connectBluetoothDevice,
  disconnectBluetoothDevice,
  getSavedDeviceAddress,
  startBluetoothScan,
} from '../util/bluetooth/BluetoothManager.ts';
// Assuming you have a custom store for showing/loading dialog

type Props = NativeStackScreenProps<RootStackParamList, 'Receipt'>;

const ReceiptScreen: React.FC<Props> = ({ route }) => {
  const { items } = route.params;
  const totalAmount = items.reduce((acc, item) => acc + item.total, 0);

  const [isConnected, setIsConnected] = useState(false);
  const [connectedDeviceAddress, setConnectedDeviceAddress] = useState<string | null>(null);
  const [devices, setDevices] = useState<any[]>([]);
  const { showLoadingDialog, hideLoadingDialog } = useLoadingDialogStore();

  useEffect(() => {
    async function loadConnection() {
      const savedAddress = await getSavedDeviceAddress();
      if (savedAddress) {
        setConnectedDeviceAddress(savedAddress);
        setIsConnected(true);
      }
    }
    loadConnection();
  }, []);

  const startBluetooth = async () => {
    try {
      const availableDevices = await startBluetoothScan();
      setDevices(availableDevices);
    } catch (err: any) {
      Alert.alert('Bluetooth Error', err.message || 'Failed to enable Bluetooth');
    }
  };

  const handleConnect = async (device: any) => {
    try {
      showLoadingDialog("Connecting...");
      const address = await connectBluetoothDevice(device);
      console.log('Connected device address:', address); // Debugging line
      setConnectedDeviceAddress(address);
      setIsConnected(true);
      Alert.alert('Success', `Connected to ${device.name}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to connect to printer.');
    } finally {
      hideLoadingDialog();
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectBluetoothDevice();
      setConnectedDeviceAddress(null);
      setIsConnected(false);
      Alert.alert('Disconnected', 'Disconnected from printer');
    } catch (error) {
      console.error('Disconnection error:', error);
      Alert.alert('Error', 'Failed to disconnect from printer.');
    }
  };

  const handlePrint = async () => {
    console.log('Printing... Is connected:', isConnected, 'Device Address:', connectedDeviceAddress);

    if (isConnected && connectedDeviceAddress) {
      try {
        // Print the receipt here (replace this with your print function)
        console.log('Receipt details:', items);
        // Example: Send items to the print function with the connected address
        await printReceipt(items, connectedDeviceAddress);
      } catch (error) {
        console.error('Print error:', error);
        Alert.alert('Error', 'Failed to print receipt.');
      }
    } else {
      Alert.alert('Bluetooth Not Connected', 'Please connect to a printer first.');
    }
  };

  const printReceipt = async (items: Item[], deviceAddress: any) => {
    // Replace with actual printing logic
    console.log('Printing receipt for device:', deviceAddress);
    console.log('Items:', items);
    // Implement your actual receipt printing logic here using BluetoothEscposPrinter methods
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Receipt</Text>

      {/* Display the items and total amount */}
      <FlatList
        data={items}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <Text style={styles.item}>
            {item.productName} - {item.quantity} x {item.price} = {item.total}
          </Text>
        )}
      />
      <Text style={styles.total}>Total: {totalAmount.toFixed(2)}</Text>

      {/* Bluetooth connection buttons */}
      {!isConnected && (
        <>
          <Button title="Start Scanning" onPress={startBluetooth} />
          {devices.map((device, i) => (
            <Button key={i} title={`Connect to ${device.name}`} onPress={() => handleConnect(device)} />
          ))}
        </>
      )}

      {/* Show Disconnect and Print buttons if connected */}
      {isConnected && (
        <>
          <Button title="Disconnect Printer" onPress={handleDisconnect} />
          <Button title="Print Sample Text" onPress={() => printReceipt([{ productName: 'Sample', quantity: 1, price: 5.0, total: 5.0 }], connectedDeviceAddress)} />
          <Button title="Print Receipt" onPress={handlePrint} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  item: { marginBottom: 5 },
  total: { marginTop: 10, fontWeight: 'bold' },
});

export default ReceiptScreen;
