import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useAuth } from "@/src/hooks/useAuth";
import { useState } from "react";
import { useRouter } from "expo-router";
import { formatFieldErrors } from "@/src/utils/formatErrors";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { getErrorMessage } from "@/src/types/api";
import { Ionicons } from "@expo/vector-icons";

export default function RegisterScreen() {
    const router = useRouter();
    const { handleRegister, isRegisterLoading, registerErrors } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = () => {
        if (!email || !password) return;
        handleRegister({ email, password });
    }

    const fieldErrors = formatFieldErrors(registerErrors?.response?.data?.errors);
    const generalErrorMessage = (registerErrors?.response?.status === 400 && Object.keys(fieldErrors).length === 0)
        ? getErrorMessage(registerErrors)
        : null;

    return (
        <KeyboardAwareScrollView
            style={styles.flex}
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps='handled'
            enableOnAndroid={true}
        >

            <View style={styles.header}>
                <Text style={styles.emoji}>🍔</Text>
                <Text style={styles.title}>Buat akun baru</Text>
                <Text style={styles.subtitle}>Daftar sekarang dan mulai pesan</Text>
            </View>

            <View style={styles.form}>

                {generalErrorMessage && (
                    <View style={styles.generalError}>
                        <Text style={styles.generalErrorText}>{generalErrorMessage}</Text>
                    </View>
                )}

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={[styles.input, fieldErrors?.email && styles.inputError]}
                        placeholder="email@example.com"
                        placeholderTextColor="#999"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    {fieldErrors?.email && (
                        <Text style={styles.fieldError}>{fieldErrors.email}</Text>
                    )}
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Password</Text>
                    <View style={[styles.passwordWrapper, fieldErrors?.password && styles.inputError]}>
                        <TextInput
                            style={styles.passwordInput}
                            placeholder="Minimal 8 karakter"
                            placeholderTextColor="#999"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            autoCapitalize="none"
                        />
                        <Pressable onPress={() => setShowPassword(!showPassword)}>
                            <Text style={styles.showText}>
                                {showPassword ? <Ionicons name="eye" size={20} color="#10b981" /> : <Ionicons name="eye-off" size={20} color="#10b981" />}
                            </Text>
                        </Pressable>
                    </View>
                    {(fieldErrors?.password) && (
                        <Text style={styles.fieldError}>{fieldErrors.password}</Text>
                    )}
                </View>

                <Pressable
                    style={[styles.button, isRegisterLoading && styles.buttonDisabled]}
                    onPress={onSubmit}
                    disabled={isRegisterLoading}
                >
                    <Text style={styles.buttonText}>
                        {isRegisterLoading ? 'Loading...' : 'Daftar'}
                    </Text>
                </Pressable>
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Udah punya akun? </Text>
                    <Pressable onPress={() => router.back()}>
                        <Text style={styles.footerLink}>Login</Text>
                    </Pressable>
                </View>
            </View>
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    emoji: {
        fontSize: 64,
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
    },
    form: {
        gap: 16,
    },
    inputGroup: {
        gap: 6,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    input: {
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        padding: 14,
        fontSize: 14,
        color: '#333',
        borderWidth: 1,
        borderColor: '#eee',
    },
    inputError: {
        borderColor: '#ff4444',
    },
    fieldError: {
        fontSize: 12,
        color: '#ff4444',
    },
    passwordWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#eee',
        paddingHorizontal: 14,
    },
    passwordInput: {
        flex: 1,
        paddingVertical: 14,
        fontSize: 14,
        color: '#333',
    },
    showText: {
        fontSize: 12,
        color: '#10b981',
        fontWeight: '600',
    },
    button: {
        backgroundColor: '#10b981',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 8,
    },
    footerText: {
        color: '#999',
        fontSize: 14,
    },
    footerLink: {
        color: '#10b981',
        fontSize: 14,
        fontWeight: '600',
    },
    generalError: {
        backgroundColor: '#fff5f5',
        borderRadius: 8,
        padding: 12,
        borderWidth: 1,
        borderColor: '#ffcccc',
    },
    generalErrorText: {
        color: '#ff4444',
        fontSize: 13,
        textAlign: 'center',
    },
});