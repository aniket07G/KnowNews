import React, { useEffect } from "react";
import { Text, View, Dimensions, StyleSheet, } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const windowHight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const Splash = ({ navigation }) => {
    useEffect(() => {
        const retrieveEmailPass = async () => {
            try {
                // This function handles persistent login by checking if a stored email-password pair exists in AsyncStorage.
                // If a valid key (email) is found, the user is navigated to the Listing screen without requiring login again.
                // Otherwise, the user is redirected to the Login screen.
                const keys = await AsyncStorage.getAllKeys();
                if (keys.length === 1) {
                    const password = await AsyncStorage.getItem(keys[0]);
                    console.log("Retrieved Password:", password);
                    navigation.replace("Listing");
                } else {
                    navigation.replace("Login");
                }
            } catch (error) {
                // If any error occurs, the user is redirected to the Login screen as a fallback.
                console.error("Error retrieving data:", error);
                navigation.replace('Login')
            }
        };
        // Introduces a slight delay before checking for stored credentials,
        // useful for displaying a splash screen or smooth transition.
        setTimeout(() => {
            retrieveEmailPass();
        }, 2000)
    }, [])
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.textmai}>Mai</Text>
            <Text style={styles.textkisan}>Kisan</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    textmai: {
        fontSize: windowWidth * 0.1,
        fontWeight: '600',
        color: '#333333'
    },
    textkisan: {
        fontSize: windowWidth * 0.1,
        fontWeight: '600',
        marginTop: -windowWidth * 0.05,
        color: '#008000'
    }
})

export default Splash;