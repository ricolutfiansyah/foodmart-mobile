import React, { useCallback } from 'react';
import { View, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useCart, useRemoveCartItem, useClearCart } from '@/src/hooks/useCart';
import { styles } from './CartScreen.styles';
import { useCartCalculations } from '@/src/hooks/useCartCalculation';
import type { CartItem } from '@/src/types/cart';
import { useDebounceQuantity } from '@/src/hooks/useDebounceQuantity';

import CartSummary from './components/CartSummary';
import CartItemComponent from './components/CartItem';
import CartHeader from './components/CartHeader';
import CartEmpty from './components/CartEmpty';


export default function CartScreen() {
    const router = useRouter();

    const { data: cartResponse, isLoading: isCartLoading } = useCart();
    const { mutate: removeCartItem } = useRemoveCartItem();
    const { mutate: clearCart } = useClearCart();
    const { handleIncrease, handleDecrease: debouncedDecrease, cancelPendingUpdate } = useDebounceQuantity();

    const cartItems = cartResponse?.data.cartItems ?? [];
    const { subtotal, deliveryFee, total } = useCartCalculations(cartItems);

    const handleDecrease = useCallback((item: CartItem) => {
        if (item.quantity > 1) {
            debouncedDecrease(item);
        } else {
            Alert.alert(
                'Hapus Item',
                'Apakah kamu yakin ingin menghapus item ini dari keranjang?',
                [
                    { text: 'Batal', style: 'cancel' },
                    {
                        text: 'Hapus',
                        style: 'destructive',
                        onPress: () => {
                            cancelPendingUpdate(item.id);
                            removeCartItem(item.id);
                        }
                    }
                ]
            );
        }
    }, [debouncedDecrease, removeCartItem, cancelPendingUpdate]);

    const handleClearCart = useCallback(() => {
        if (cartItems.length === 0) return;
        Alert.alert(
            'Kosongkan Keranjang',
            'Apakah kamu yakin ingin mengosongkan seluruh isi keranjang?',
            [
                { text: 'Batal', style: 'cancel' },
                { text: 'Ya, Kosongkan', style: 'destructive', onPress: () => clearCart() }
            ]
        );
    }, []);

    const handleCheckout = () => {
        Alert.alert('Sukses', 'Lanjut ke pembayaran...');
    };

    if (isCartLoading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#10b981" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <CartHeader
                hasItems={cartItems.length > 0}
                onBack={() => router.back()}
                onClear={handleClearCart}
            />

            {/* Cart Items */}
            <FlatList
                data={cartItems}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <CartItemComponent
                        item={item}
                        onIncrease={handleIncrease}
                        onDecrease={handleDecrease}
                    />
                )}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <CartEmpty onExplore={() => router.replace('/product')} />
                }
            />

            {/* Checkout Summary */}
            {cartItems.length > 0 && (
                <CartSummary
                    subtotal={subtotal}
                    deliveryFee={deliveryFee}
                    total={total}
                    onCheckout={handleCheckout}
                />
            )}
        </View>
    );
}
