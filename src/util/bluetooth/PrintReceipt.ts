import { BluetoothEscposPrinter } from '@ccdilan/react-native-bluetooth-escpos-printer';
import {Alert} from 'react-native';

export const printReceipt = async (items: any, connectedDeviceAddress: any, handleDisconnect: any, handleConnect: any) => {
    try {
        if (!connectedDeviceAddress) {
            throw new Error("No device connected");
        }

        let receipt = "Receipt    \r\n\r\n";
        receipt += "Item                     \r\n";
        receipt += "------------------------------------------------\r\n";

        const itemColWidth = 18;
        for (const item of items) {
            receipt += `${item.name.padEnd(itemColWidth)}${('      Dropping Soon')}\r\n`;
        }

        receipt += "------------------------------------------------\r\n";
        receipt += `Company - Coming Soon\r\n\r\n`;
        receipt += "Thank you for choosing us!\r\n";
        receipt += "             #CompanyVibe       \r\n";

        // Retry logic: Disconnect, Reconnect, and then Print
        await handleDisconnect(); // Disconnect if there's any issue
        await handleConnect({ address: connectedDeviceAddress || '', name: 'Printer' }); // Reconnect

        await BluetoothEscposPrinter.printText(receipt, {});
        await BluetoothEscposPrinter.printText("\r\n\r\n\r\n", {}); // Add some spacing after the print
        console.log('Print successful');
    } catch (err: any) {
        console.error("Print error:", err);
        Alert.alert('Error printing: ' + err.message);
    }
};
