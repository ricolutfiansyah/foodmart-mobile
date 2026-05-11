import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function DetailScreen() {
  const router = useRouter();
  const { nama, telp, kota } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{String(nama[0])}</Text>
      </View>

      <Text style={styles.nama}>{nama}</Text>

      <View style={styles.infoBox}>
        <Text style={styles.label}>📩 Phone</Text>
        <Text style={styles.value}>{telp}</Text>
      </View>


      <View style={styles.infoBox}>
        <Text style={styles.label}>📍 City</Text>
        <Text style={styles.value}>{kota}</Text>
      </View>

      <Pressable style={styles.tombol} onPress={() => router.back()}>
        <Text style={styles.tombolText}>← Kembali</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6C63FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  nama: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  infoBox: {
    width: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  tombol: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  tombolText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});