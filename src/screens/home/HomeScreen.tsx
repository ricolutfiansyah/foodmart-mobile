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
    Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFoods } from '@/src/hooks/useFoods';
import { useDebounced } from '@/src/hooks/useDebounced';
import { SkeletonBox } from '@/src/components/shared/skeleton/SkeletonBox';
import { useCategories } from '@/src/hooks/useCategories';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 2;

export default function HomeScreen() {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>();
    const debouncedSearch = useDebounced(search, 500);
    const { data: categories, isLoading: categoriesIsLoading, error: categoriesError } = useCategories();
    const { data: foods, isLoading, error } = useFoods({ search: debouncedSearch, categoryId: selectedCategory });


    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Halo, Mau makan apa?</Text>
                    <Text style={styles.location}>
                        <Ionicons name="location" size={14} color="#10b981" /> Jakarta, Indonesia
                    </Text>
                </View>
                <Pressable style={styles.cartButton} onPress={() => router.push('/cart')}>
                    <Ionicons name="cart-outline" size={24} color="#333" />
                    <View style={styles.cartBadge}>
                        <Text style={styles.cartBadgeText}>2</Text>
                    </View>
                </Pressable>
            </View>

            {/* Search Bar */}
            <View style={styles.searchSection}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="#94a3b8" />
                    <TextInput
                        placeholder="Cari makanan favoritmu..."
                        placeholderTextColor="#94a3b8"
                        style={styles.searchInput}
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>
                <Pressable style={styles.filterButton}>
                    <Ionicons name="options-outline" size={20} color="#fff" />
                </Pressable>
            </View>

            {/* Categories */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Kategori</Text>
                <Pressable onPress={() => { setSearch(''); Keyboard.dismiss(); }}>
                    <Text style={styles.seeAll}>Lihat Semua</Text>
                </Pressable>
            </View>

            {categoriesIsLoading ? (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoriesContainer}
                    style={styles.categoriesScroll}>
                    {Array.from({ length: 5 }).map((_, index) => (
                        <SkeletonBox key={index} width={90} height={38} borderRadius={20} />
                    ))}
                </ScrollView>
            ) : (
                <ScrollView
                    horizontal
                    keyboardShouldPersistTaps='handled'
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoriesContainer}
                    style={styles.categoriesScroll}
                >
                    <Pressable
                        disabled={categoriesIsLoading}
                        style={[
                            styles.categoryCard,
                            selectedCategory === undefined && styles.categoryCardActive
                        ]}
                        onPress={() => {
                            setSelectedCategory(undefined);
                        }}
                    >
                        <Text style={[
                            styles.categoryText,
                            selectedCategory === undefined && styles.categoryTextActive
                        ]}>
                            All
                        </Text>
                    </Pressable>
                    {categories?.data.map((cat) => (
                        <Pressable
                            disabled={categoriesIsLoading}
                            key={cat.id}
                            style={[
                                styles.categoryCard,
                                cat.id === selectedCategory && styles.categoryCardActive
                            ]}
                            onPress={() => {
                                setSelectedCategory(cat.id === selectedCategory ? undefined : cat.id)
                            }}
                        >
                            <Text style={[
                                styles.categoryText,
                                cat.id === selectedCategory && styles.categoryTextActive
                            ]}>
                                {cat.name}
                            </Text>
                        </Pressable>
                    ))}
                </ScrollView>
            )}

            {isLoading ? (
                <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                    <View style={styles.listHeader}>
                        <Text style={styles.sectionTitle}>Populer Sekarang</Text>
                    </View>
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
                    style={{ flex: 1 }}
                    data={foods?.data}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={
                        <View style={styles.listHeader}>
                            <Text style={styles.sectionTitle}>Populer Sekarang</Text>
                        </View>
                    }
                    contentContainerStyle={styles.listContent}
                    columnWrapperStyle={styles.columnWrapper}
                    renderItem={({ item }) => (
                        <View style={styles.productCard}>
                            <View style={styles.imagePlaceholder}>
                                <Text style={styles.productEmoji}>{item.imageUrl}</Text>
                                <Pressable style={styles.favoriteButton}>
                                    <Ionicons name="heart-outline" size={16} color="#ef4444" />
                                </Pressable>
                            </View>
                            <View style={styles.productInfo}>
                                <Text style={styles.productCategory}>{item.category?.name}</Text>
                                <Text style={styles.productName}>{item.name}</Text>
                                <View style={styles.priceRow}>
                                    <Text style={styles.productPrice}>Rp {item.price}</Text>
                                    <Pressable style={styles.addButton}>
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
        paddingHorizontal: 18
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 10,
    },
    greeting: {
        fontSize: 14,
        color: '#64748b',
    },
    location: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1e293b',
        marginTop: 2,
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
        marginVertical: 20,
        gap: 12,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    searchInput: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 14,
        color: '#1e293b',
    },
    filterButton: {
        width: 48,
        height: 48,
        backgroundColor: '#10b981',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
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
    categoriesContainer: {
        gap: 12,
    },
    categoriesScroll: {
        maxHeight: 40,
        marginBottom: 20,
    },
    listHeader: {
        marginBottom: 16,
        marginTop: 10,
    },
    listContent: {
        paddingBottom: 10,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    categoryCard: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#fff',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    categoryCardActive: {
        backgroundColor: '#10b981',
        borderColor: '#10b981',
    },
    categoryText: {
        fontSize: 14,
        color: '#64748b',
        fontWeight: '600',
    },
    categoryTextActive: {
        color: '#fff',
    },
    productCard: {
        width: COLUMN_WIDTH,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: '#f1f5f9',
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
    favoriteButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 28,
        height: 28,
        backgroundColor: '#fff',
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    productInfo: {
        gap: 4,
    },
    productCategory: {
        fontSize: 12,
        color: '#94a3b8',
    },
    productName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingText: {
        fontSize: 12,
        color: '#64748b',
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    productPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#10b981',
    },
    addButton: {
        width: 32,
        height: 32,
        backgroundColor: '#10b981',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
