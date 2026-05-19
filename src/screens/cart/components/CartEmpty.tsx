import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../CartScreen.styles';

interface CartEmptyProps {
    onExplore: () => void;
}

export default function CartEmpty({ onExplore }: CartEmptyProps) {
    return (
        <View style={styles.emptyContainer}>
            <Ionicons name="cart-outline" size={80} color="#cbd5e1" />
            <Text style={styles.emptyTitle}>Keranjang Kosong</Text>
            <Text style={styles.emptySubtitle}>
                Sepertinya kamu belum menambahkan makanan apapun ke keranjang.
            </Text>
            <Pressable style={styles.exploreButton} onPress={onExplore}>
                <Text style={styles.exploreButtonText}>Cari Makanan</Text>
            </Pressable>
        </View>
    );
}