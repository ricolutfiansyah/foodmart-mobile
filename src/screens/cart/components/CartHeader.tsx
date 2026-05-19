import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../CartScreen.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CartHeaderProps {

    hasItems: boolean;
    onBack: () => void;
    onClear: () => void;
}

export default function CartHeader({ hasItems, onBack, onClear }: CartHeaderProps) {
    const insets = useSafeAreaInsets();
    return (
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
            <Pressable onPress={onBack} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#1e293b" />
            </Pressable>
            <Text style={styles.headerTitle}>Keranjang</Text>
            <Pressable
                onPress={onClear}
                style={styles.clearButton}
                disabled={!hasItems}
            >
                <Ionicons
                    name="trash-outline"
                    size={22}
                    color={hasItems ? '#ef4444' : '#cbd5e1'}
                />
            </Pressable>
        </View>
    );
}