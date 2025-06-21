import React, { useEffect } from "react";
import { Text, View, Dimensions, StyleSheet, } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const windowHight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const Splash = ({ navigation }) => {
    useEffect(() => {
        const retrieveEmailPass = async () => {
            try {
                const isLoggedIn = await AsyncStorage.getItem("userLoggedIn");
                if (isLoggedIn) {
                    navigation.replace("Listing");
                } else {
                    navigation.replace("Login");
                }
            } catch (error) {
                console.error("Error retrieving data:", error);
                navigation.replace('Login')
            }
        };
        setTimeout(() => {
            retrieveEmailPass();
        }, 2000)
    }, [])
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.textmai}>Know</Text>
            <Text style={styles.textkisan}>News</Text>
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