
# Thermal Printer Helper

This repository is designed to help you easily interact with a **thermal printer** in a React Native app. It allows you to input product names, quantities, and prices, and dynamically print them with a clean and easy-to-read format. 

I’ve made it simple for you to use and customize the functionality to suit your needs. The features of this project include **scanning**, **connecting**, **disconnecting**, and **printing** via Bluetooth.

## Features

- **Scan for Bluetooth Devices**: Automatically scan and detect Bluetooth printers.
- **Connect to Printer**: Connect to a thermal printer using Bluetooth.
- **Disconnect from Printer**: Disconnect from the thermal printer when done.
- **Print Receipts**: Print receipts with formatted product information, including product name, quantity, price, and total.

## How to Use

### 1. **Install Dependencies**

This project uses `@ccdilan/react-native-bluetooth-escpos-printer` to interact with the thermal printer.

To install the necessary dependencies, run:

```bash
npm install @ccdilan/react-native-bluetooth-escpos-printer
```

### 2. **Set Permissions in `AndroidManifest.xml`**

Make sure to set the **Bluetooth permissions** in your `AndroidManifest.xml`. Without these permissions, the app will not be able to scan or connect to Bluetooth devices.

Open `android/app/src/main/AndroidManifest.xml` and add the following permissions:

```xml
<uses-permission android:name="android.permission.BLUETOOTH" />
<uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
<uses-permission android:name="android.permission.BLUETOOTH_CONNECT" android:maxSdkVersion="31"/>
<uses-permission android:name="android.permission.BLUETOOTH_SCAN" android:maxSdkVersion="31"/>
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```

These permissions are necessary for **Bluetooth scanning** and **connecting** to devices.

### 3. **Usage in Your App**

- **Scanning for Devices**: You can scan for available Bluetooth devices that are capable of printing using the app.
  
- **Connecting to the Printer**: After scanning, connect to your printer by selecting it.

- **Disconnecting**: You can disconnect from the printer when done.

- **Dynamic Printing**: You can input product details like name, quantity, and price dynamically, and the app will generate a receipt with a simple layout.

### Example Usage:

```tsx
import { connectBluetoothDevice, startBluetoothScan, disconnectBluetoothDevice } from './bluetoothManager';

const startScan = async () => {
  const devices = await startBluetoothScan();
  console.log('Available Devices:', devices);
};

const connectToDevice = async (device) => {
  await connectBluetoothDevice(device);
  console.log(`Connected to ${device.name}`);
};

const disconnectDevice = async () => {
  await disconnectBluetoothDevice();
  console.log('Disconnected from the printer');
};
```

### 4. **Customization**

Feel free to customize the receipt layout, the columns for product name, quantity, and price, as well as the font style, according to your needs. This project is designed to be easily configurable, so you can adjust the formatting to match your printer's specifications.

## Dependencies

This repository uses the following dependencies:

- `@ccdilan/react-native-bluetooth-escpos-printer`: A library to handle Bluetooth communication with thermal printers.
  
  **Install it by running**:
  
  ```bash
  npm install @ccdilan/react-native-bluetooth-escpos-printer
  ```

## Troubleshooting

If you encounter any issues with Bluetooth scanning, ensure that Bluetooth is enabled on your device and that the necessary permissions are granted. Additionally, make sure your printer is paired with your Android device.

## License

This repository is open-source and available under the [MIT License](LICENSE).
