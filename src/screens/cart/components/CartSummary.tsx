import React from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { styles } from '../CartScreen.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CartSummaryProps {
    subtotal: number;
    deliveryFee: number;
    total: number;
    onCheckout: () => void;
}

export default function CartSummary({
    subtotal,
    deliveryFee,
    total,
    onCheckout,
}: CartSummaryProps) {
    const insets = useSafeAreaInsets();

    return (
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

            <Pressable style={styles.checkoutButton} onPress={onCheckout}>
                <Text style={styles.checkoutButtonText}>Checkout Sekarang</Text>
            </Pressable>
        </View>
    );
}