import React from 'react';
import {View, Text, FlatList, Button, StyleSheet, Alert} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Receipt'>;

const ReceiptScreen: React.FC<Props> = ({ route }) => {
  const { items } = route.params;
  const totalAmount = items.reduce((acc, item) => acc + item.total, 0);

  const printReceipt = () => {
    Alert.alert('Printing receipt...');
    // Integrate with `react-native-print` if needed.
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Receipt</Text>
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
      <Button title="Print Receipt" onPress={printReceipt} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  item: { marginBottom: 5 },
  total: { marginTop: 10, fontWeight: 'bold' },
});

export default ReceiptScreen;
