import { BluetoothEscposPrinter } from '@ccdilan/react-native-bluetooth-escpos-printer';
import {Alert} from 'react-native';

export const printReceipt = async (items: any, connectedDeviceAddress: any, handleDisconnect: any, handleConnect: any) => {
  try {
    if (!connectedDeviceAddress) {
      throw new Error("No device connected");
    }
    // Function to format numbers with '.' as thousands separator
    const formatCurrency = (amount: number) => {
      return 'Rp '+amount
        .toString() // Convert number to string
        .split('') // Split the number into individual characters
        .reverse() // Reverse the string to make it easier to group digits
        .reduce((acc: string[], digit, index) => { // Explicitly define acc as string[]
          if (index % 3 === 0 && index !== 0) {
            acc.push('.'); // Add a dot every 3 digits
          }
          acc.push(digit); // Push the current digit
          return acc;
        }, []) // Initialize acc as an empty array of strings
        .reverse() // Reverse back to the correct order
        .join(''); // Join the array into a string
    };

    let receipt = "Receipt    \r\n\r\n";
    receipt += "Item Name      Qty      Price       Total    \r\n";
    receipt += "------------------------------------------------\r\n";

    const itemColWidth = 14;
    const quantityColWidth = 4;
    const priceColWidth = 10;
    const totalColWidth = 14;

    // Loop through the items and format them
    for (const item of items) {
      const productName = item.productName.padEnd(itemColWidth); // Align product name to the left
      const quantity = String(item.quantity).padStart(quantityColWidth); // Align quantity to the right
      const price = formatCurrency(item.price).padStart(priceColWidth); // Format price as currency and align it to the right
      const total = formatCurrency(item.total).padStart(totalColWidth); // Format total as currency and align it to the right

      receipt += `${productName}${quantity} ${price} ${total} \r\n`;
    }

    receipt += "------------------------------------------------\r\n";
    receipt += `Company - Coming Soon\r\n\r\n`;
    receipt += "Thank you for choosing us!\r\n";
    receipt += "             #CompanyVibe       \r\n";

    // Retry logic: Disconnect, Reconnect, and then Print
    await handleDisconnect(); // Disconnect if there's any issue
    await handleConnect({ address: connectedDeviceAddress || '', name: 'Printer' }); // Reconnect

    // Print the receipt text
    await BluetoothEscposPrinter.printText(receipt, {});
    await BluetoothEscposPrinter.printText("\r\n\r\n\r\n", {}); // Add some spacing after the print
    console.log('Print successful');
  } catch (err: any) {
    console.error("Print error:", err);
    Alert.alert('Error printing: ' + err.message);
  }
};
