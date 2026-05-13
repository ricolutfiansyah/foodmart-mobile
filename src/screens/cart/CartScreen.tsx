import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Dummy data
const DUMMY_CART_ITEMS = [
  {
    id: '1',
    name: 'Nasi Goreng Spesial',
    price: 35000,
    quantity: 2,
    image: '🍽️',
    category: 'Indonesian'
  },
  {
    id: '2',
    name: 'Es Teh Manis',
    price: 5000,
    quantity: 2,
    image: '🥤',
    category: 'Beverage'
  },
  {
    id: '3',
    name: 'Sate Ayam Madura',
    price: 25000,
    quantity: 1,
    image: '🍢',
    category: 'Indonesian'
  }
];

export default function CartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Calculate totals
  const subtotal = DUMMY_CART_ITEMS.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 10000;
  const total = subtotal + deliveryFee;

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.cartItem}>
      <View style={styles.itemImageContainer}>
        <Text style={styles.itemEmoji}>{item.image}</Text>
      </View>
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemCategory}>{item.category}</Text>
        <Text style={styles.itemPrice}>Rp {item.price.toLocaleString('id-ID')}</Text>
      </View>
      <View style={styles.quantityContainer}>
        <Pressable style={styles.quantityButton}>
          <Ionicons name="remove" size={16} color="#64748b" />
        </Pressable>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <Pressable style={styles.quantityButton}>
          <Ionicons name="add" size={16} color="#64748b" />
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { flex: 1, backgroundColor: '#f8fafc' }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </Pressable>
        <Text style={styles.headerTitle}>Keranjang</Text>
        <View style={{ width: 40 }} />
        {/* Placeholder for balance */}
      </View>

      {/* Cart Items */}
      <FlatList
        data={DUMMY_CART_ITEMS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Checkout Summary */}
      <View style={[styles.summaryContainer, { paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>Rp {subtotal.toLocaleString('id-ID')}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Ongkos Kirim</Text>
          <Text style={styles.summaryValue}>Rp {deliveryFee.toLocaleString('id-ID')}</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>Rp {total.toLocaleString('id-ID')}</Text>
        </View>

        <Pressable style={styles.checkoutButton}>
          <Text style={styles.checkoutButtonText}>Checkout Sekarang</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  listContent: {
    padding: 18,
    gap: 16,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  itemImageContainer: {
    width: 64,
    height: 64,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemEmoji: {
    fontSize: 32,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 6,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#10b981',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  quantityButton: {
    padding: 4,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
    marginHorizontal: 12,
  },
  summaryContainer: {
    backgroundColor: '#fff',
    padding: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10b981',
  },
  checkoutButton: {
    backgroundColor: '#10b981',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
