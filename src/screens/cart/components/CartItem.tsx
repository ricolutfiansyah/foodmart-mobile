import React, { memo } from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { CartItem as CartItemType } from '@/src/types/cart';
import { styles } from '../CartScreen.styles';

interface CartItemsProp {
    item: CartItemType;
    onIncrease: (item: CartItemType) => void;
    onDecrease: (item: CartItemType) => void;
}

const CartItemComponent = ({ item, onIncrease, onDecrease }: CartItemsProp) => {
    return (
        <View style={styles.cartItem}>
            <View style={styles.itemImageContainer}>
                {item.food.imageUrl ? (
                    <Image source={{ uri: item.food.imageUrl }} style={styles.itemImage} />
                ) : (
                    <Text style={styles.itemEmoji}>🍽️</Text>
                )}
            </View>

            <View style={styles.itemDetails}>
                <Text style={styles.itemName} numberOfLines={1}>
                    {item.food.name}
                </Text>
                <Text style={styles.itemCategory}>
                    {item.food.category?.name || 'Makanan'}
                </Text>
                <Text style={styles.itemPrice}>
                    Rp {Number(item.food.price).toLocaleString('id-ID')}
                </Text>
            </View>

            <View style={styles.quantityContainer}>
                <Pressable
                    style={styles.quantityButton}
                    onPress={() => onDecrease(item)}
                >
                    <Ionicons
                        name={item.quantity > 1 ? 'remove' : 'trash-outline'}
                        size={16}
                        color={item.quantity > 1 ? '#64748b' : '#ef4444'}
                    />
                </Pressable>
                <Text style={styles.quantityText}>{item.quantity}</Text>
                <Pressable
                    style={styles.quantityButton}
                    onPress={() => onIncrease(item)}
                >
                    <Ionicons name="add" size={16} color="#64748b" />
                </Pressable>
            </View>
        </View>
    );
};

export default memo(CartItemComponent);