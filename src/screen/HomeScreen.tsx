import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, Button, FlatList, StyleSheet, Platform, PermissionsAndroid, Alert} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, Item } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [items, setItems] = useState<Item[]>([]);

  const requestPermissions = async () => {
    try {

      if (Platform.OS === 'android' && Platform.Version >= 31) {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);

        const allGranted = Object.values(granted).every(
          (status) => status === PermissionsAndroid.RESULTS.GRANTED
        );

        if (!allGranted) {
          Alert.alert('bluetooth Permissions', 'Please grant all required permissions.');
        }
      }
    } catch (error) {
      console.error('[Permission Error]', error);
    }
  };

  useEffect(() => {
    requestPermissions();
  }, []);


  const addItem = () => {
    const qty = parseInt(quantity);
    const prc = parseFloat(price);
    if (!productName || isNaN(qty) || isNaN(prc)) return;

    const total = qty * prc;
    const newItem: Item = { productName, quantity: qty, price: prc, total };
    setItems([...items, newItem]);

    setProductName('');
    setQuantity('');
    setPrice('');
  };

  const goToReceipt = () => {
    navigation.navigate('Receipt', { items });
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Product Name"
        value={productName}
        onChangeText={setProductName}
        style={styles.input}
      />
      <TextInput
        placeholder="Quantity"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button title="Add Item" onPress={addItem} />

      <FlatList
        data={items}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <Text style={styles.item}>
            {item.productName} - {item.quantity} x {item.price} = {item.total}
          </Text>
        )}
      />

      {items.length > 0 && <Button title="See Receipt" onPress={goToReceipt} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: {
    borderWidth: 1,
    marginVertical: 8,
    padding: 10,
    borderRadius: 5,
  },
  item: { marginTop: 5 },
});

export default HomeScreen;
