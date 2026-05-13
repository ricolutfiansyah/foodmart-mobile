import { View, Text, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { useAuth } from "@/src/hooks/useAuth";
import { useAuthStore } from "@/src/store/authStore";

export default function ProfileScreen() {
    const { handleLogout, isLogoutLoading } = useAuth();
    const { user } = useAuthStore();
    return (
        <View style={styles.container}>
            <Text style={styles.judul}>👤 Profile</Text>
            <View>
                <Text style={{ fontSize: 16, color: 'gray' }}>Email: {user?.email}</Text>
                <Text style={{ fontSize: 16, color: 'gray' }}>Role: {user?.role}</Text>
            </View>
            <Pressable
                disabled={isLogoutLoading}
                style={[
                    { backgroundColor: 'red', padding: 10, marginTop: 10, borderRadius: 10, alignItems: 'center', minWidth: 120 },
                    isLogoutLoading && { opacity: 0.7 }
                ]}
                onPress={() => handleLogout()}
            >
                {isLogoutLoading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Logout</Text>
                )}
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f0f0f0",
        alignItems: "center",
        justifyContent: "center",
    },
    judul: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 8,
    },
    sub: {
        fontSize: 16,
        color: "#666",
    },
});
