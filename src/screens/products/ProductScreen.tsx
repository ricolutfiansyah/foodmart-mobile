import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    FlatList,
    Pressable,
    Dimensions,
    ScrollView,
    Keyboard,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFoods } from '@/src/hooks/useFoods';
import { useCategories } from '@/src/hooks/useCategories';
import { SkeletonBox } from '@/src/components/shared/skeleton/SkeletonBox';
import { router } from 'expo-router';
import { useDebounced } from '@/src/hooks/useDebounceSearch';
import { useCart, useAddToCart } from '@/src/hooks/useCart';
import { Alert } from 'react-native';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 2;

export default function ProductScreen() {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>();
    const debouncedSearch = useDebounced(search, 300);
    const { data: categories, isLoading: categoriesIsLoading } = useCategories();
    const {
        data: foods,
        isLoading: foodsIsLoading,
        refetch: foodsRefetch,
        isRefetching: isFoodsRefetching,
        fetchNextPage: foodsFetchNextPage,
        hasNextPage: foodsHasNextPage,
        isFetchingNextPage: isFoodsFetchingNextPage
    } = useFoods({
        search: debouncedSearch,
        categoryId: selectedCategory
    });
    const allFoods = foods?.pages.flatMap(page => page.data) ?? [];

    const { data: cartResponse } = useCart();
    const { mutate: addToCart, isPending: isAddingToCart } = useAddToCart();

    const cartCount = cartResponse?.data.cartItems.reduce((acc, item) => acc + item.quantity, 0) ?? 0;

    const handleAddToCart = (foodId: string) => {
        addToCart({ foodId, quantity: 1 }, {
            onError: (error) => {
                if (error.response?.status === 401) return;

                const message = error.response?.data?.message || 'Gagal menambahkan ke keranjang';
                Alert.alert('Error', message);
            }
        });
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Daftar Menu</Text>
                    <Text style={styles.headerSubtitle}>Temukan makanan lezat untukmu</Text>
                </View>
                <Pressable style={styles.cartButton} onPress={() => router.push('/cart')}>
                    <Ionicons name="cart-outline" size={24} color="#333" />
                    {cartCount > 0 && (
                        <View style={styles.cartBadge}>
                            <Text style={styles.cartBadgeText}>{cartCount}</Text>
                        </View>
                    )}
                </Pressable>
            </View>

            {/* Search Bar */}
            <View style={styles.searchSection}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="#94a3b8" style={styles.searchIcon} />
                    <TextInput
                        placeholder="Cari burger, pizza, dll..."
                        placeholderTextColor="#94a3b8"
                        value={search}
                        onChangeText={setSearch}
                        style={styles.searchInput}
                    />
                </View>
                <Pressable style={styles.filterButton}>
                    <Ionicons name="options-outline" size={20} color="#fff" />
                </Pressable>
            </View>

            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Kategori</Text>
                <Pressable onPress={() => { setSearch(''); Keyboard.dismiss(); }}>
                    <Text style={styles.seeAll}>Lihat Semua</Text>
                </Pressable>
            </View>

            {/* Categories Tabs */}
            {categoriesIsLoading ? (
                <View style={styles.categoriesWrapper}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.categoriesContainer}
                    >
                        {Array.from({ length: 5 }).map((_, index) => (
                            <SkeletonBox key={index} width={90} height={38} borderRadius={14} />
                        ))}
                    </ScrollView>
                </View>
            ) : (
                <View style={styles.categoriesWrapper}>
                    <ScrollView
                        horizontal
                        keyboardShouldPersistTaps='handled'
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.categoriesContent}
                    >
                        <Pressable
                            style={[
                                styles.categoryItem,
                                selectedCategory === undefined && styles.categoryItemActive
                            ]}
                            onPress={() => setSelectedCategory(undefined)}
                        >
                            <Text style={[
                                styles.categoryText,
                                selectedCategory === undefined && styles.categoryTextActive
                            ]}>All</Text>
                        </Pressable>
                        {categories?.data.map((cat) => (
                            <Pressable
                                key={cat.id}
                                onPress={() => {
                                    setSelectedCategory(cat.id === selectedCategory ? undefined : cat.id)
                                }}
                                style={[
                                    styles.categoryItem,
                                    selectedCategory === cat.id && styles.categoryItemActive
                                ]}
                            >
                                <Text style={[
                                    styles.categoryText,
                                    selectedCategory === cat.id && styles.categoryTextActive
                                ]}>
                                    {cat.name}
                                </Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>
            )}

            {/* Product List */}
            {foodsIsLoading ? (
                <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 16 }}>
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <View key={i} style={styles.productCard}>
                                <SkeletonBox width="100%" height={120} borderRadius={12} style={{ marginBottom: 12 }} />
                                <View style={styles.productInfo}>
                                    <SkeletonBox width="40%" height={12} borderRadius={4} style={{ marginBottom: 4 }} />
                                    <SkeletonBox width="80%" height={16} borderRadius={4} style={{ marginBottom: 8 }} />
                                    <View style={styles.priceRow}>
                                        <SkeletonBox width="60%" height={14} borderRadius={4} />
                                        <SkeletonBox width={32} height={32} borderRadius={10} />
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            ) : (
                <FlatList
                    data={allFoods}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                    columnWrapperStyle={styles.columnWrapper}
                    ListHeaderComponent={
                        <View style={[styles.listHeader, { flexDirection: 'row', justifyContent: 'flex-end' }]}>
                            <Text style={styles.listCount}>{allFoods?.length || 0} Makanan tersedia</Text>
                        </View>
                    }
                    onRefresh={foodsRefetch}
                    refreshing={isFoodsRefetching}
                    onEndReached={() => {
                        if (foodsHasNextPage && !isFoodsFetchingNextPage) foodsFetchNextPage();
                    }}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={
                        isFoodsFetchingNextPage ? (
                            <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                                <ActivityIndicator size="small" color="#0ea5e9" />
                            </View>
                        ) : null
                    }
                    renderItem={({ item }) => (
                        <View style={styles.productCard}>
                            <View style={styles.imagePlaceholder}>
                                <Pressable style={styles.favoriteButton}>
                                    <Ionicons name="heart-outline" size={16} color="#ef4444" />
                                </Pressable>
                            </View>
                            <View style={styles.productInfo}>
                                <Text style={styles.productCategory}>{item.category?.name}</Text>
                                <Text style={styles.productName}>{item.name}</Text>
                                <View style={styles.priceRow}>
                                    <Text style={styles.productPrice}>Rp {item.price}</Text>
                                    <Pressable
                                        style={[styles.addButton, isAddingToCart && { opacity: 0.7 }]}
                                        onPress={() => handleAddToCart(item.id)}
                                        disabled={isAddingToCart}
                                    >
                                        <Ionicons name="add" size={20} color="#fff" />
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    )}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1e293b',
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#64748b',
        marginTop: 2,
    },
    notificationButton: {
        width: 48,
        height: 48,
        backgroundColor: '#fff',
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    notificationDot: {
        position: 'absolute',
        top: 14,
        right: 14,
        width: 8,
        height: 8,
        backgroundColor: '#ef4444',
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#fff',
    },
    cartButton: {
        width: 44,
        height: 44,
        backgroundColor: '#fff',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    cartBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#ef4444',
        borderRadius: 8,
        minWidth: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    searchSection: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 12,
        marginBottom: 20,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 52,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: '#1e293b',
        fontWeight: '500',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    seeAll: {
        fontSize: 14,
        color: '#10b981',
        fontWeight: '600',
    },
    filterButton: {
        width: 52,
        height: 52,
        backgroundColor: '#10b981',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#10b981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    categoriesContainer: {
        gap: 12,
        paddingHorizontal: 20,
    },
    categoriesWrapper: {
        marginBottom: 20,
    },
    categoriesContent: {
        paddingHorizontal: 20,
        gap: 10,
    },
    categoryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        gap: 8,
    },
    categoryItemActive: {
        backgroundColor: '#10b981',
        borderColor: '#10b981',
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748b',
    },
    categoryTextActive: {
        color: '#fff',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 24,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 16,
    },
    listTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1e293b',
    },
    listCount: {
        fontSize: 12,
        color: '#94a3b8',
    },
    productCard: {
        width: COLUMN_WIDTH,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
    },
    imagePlaceholder: {
        width: '100%',
        height: 120,
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    productEmoji: {
        fontSize: 48,
    },
    imageContainer: {
        width: '100%',
        height: 130,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#f1f5f9',
    },
    productImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    favoriteButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 32,
        height: 32,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    productInfo: {
        marginTop: 12,
        paddingHorizontal: 2,
    },
    productCategory: {
        fontSize: 12,
        color: '#94a3b8',
        letterSpacing: 0.5,
    },
    productName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1e293b',
        marginTop: 2,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    productPrice: {
        fontSize: 14,
        fontWeight: '800',
        color: '#10b981',
    },
    addButton: {
        width: 34,
        height: 34,
        backgroundColor: '#10b981',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#10b981',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    }
});
