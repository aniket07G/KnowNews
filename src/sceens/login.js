import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import UserIcon from "react-native-vector-icons/FontAwesome";
import auth from '@react-native-firebase/auth';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const windowHight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            setEmail("");
            setPassword("");
        }, [])
    );

    const storeSession = async () => {
        try {
            // Stores the user session by saving the email-password pair in AsyncStorage.
            // Ensures only one session exists by clearing previous stored data before saving new credentials.
            // After storing the session, the user is navigated to the Listing screen.
            console.log("StoreSession");
            await AsyncStorage.clear();
            await AsyncStorage.setItem(String(email), String(password));
            navigation.replace('Listing');
        } catch (error) {
            // In case of an error, still navigate the user to the Listing screen.
            navigation.replace('Listing');
        }
        setLoading(false); // Stops loading indicator.
    }

    const loginUser = () => {
        // Handles user authentication when the login button is pressed.
        // Uses Firebase Authentication to verify the entered email and password.
        // If successful, the user is signed in, and the session is stored.
        // If authentication fails, appropriate error messages are displayed.
        setLoading(true);
        auth()
            .signInWithEmailAndPassword(email, password)
            .then(() => {
                console.log('User account created & signed in!');
                storeSession(); // Stores the session for persistence.
            })
            .catch(error => {
                // Handles different types of authentication errors and displays relevant messages.
                setLoading(false);
                if (error.code === "auth/invalid-credential") {
                    Alert.alert("Invalid email or password!");
                    setEmail('');
                    setPassword('');
                } else if (error.code === "auth/network-request-failed") {
                    Alert.alert("No internet connection. Please check your network.");
                } else {
                    Alert.alert("An unknown error occurred.");
                }
            });
    }

    return (
        <View style={styles.container}>
            <View style={{ marginTop: windowHight * 0.2, alignSelf: 'center' }}>
                <UserIcon name='user-circle' size={windowWidth * 0.2} color={'#007bff'} />
            </View>
            <TextInput
                style={styles.forUsername}
                value={email}
                placeholder="Enter email"
                placeholderTextColor="gray"
                onChangeText={(text) => {
                    setEmail(text);
                }}
            />
            <TextInput
                style={styles.forPassword}
                value={password}
                placeholder="Enter Password"
                placeholderTextColor="gray"
                onChangeText={(text) => {
                    setPassword(text);
                }}
            />
            <TouchableOpacity style={styles.loginButton} onPress={() => loginUser()}>
                {!loading ?
                    <Text style={styles.buttonText}>Login</Text>
                    : <ActivityIndicator size={"large"} color={'white'} />
                }
            </TouchableOpacity>
            {!loading ?
                <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.resgisterText}>Register</Text>
                </TouchableOpacity> : null
            }
        </View>

    )
}


const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex: 1,
    },
    forUsername: {
        width: windowWidth * 0.85, // Responsive width
        height: windowHight * 0.075,
        borderWidth: 2,  // Required for visible border
        borderColor: 'black',
        borderRadius: 10,
        paddingHorizontal: 10,
        fontSize: windowWidth * 0.04,
        alignSelf: 'center',
        marginTop: windowHight * 0.03,
        paddingLeft: windowWidth * 0.04
    },
    forPassword: {
        width: windowWidth * 0.85, // Responsive width
        height: windowHight * 0.075,
        borderWidth: 2,  // Required for visible border
        borderColor: 'black',
        borderRadius: 10,
        paddingHorizontal: 10,
        fontSize: windowWidth * 0.04,
        alignSelf: 'center',
        marginTop: windowHight * 0.03,
        paddingLeft: windowWidth * 0.04
    },
    loginButton: {
        width: windowWidth * 0.85,
        height: windowHight * 0.075,
        backgroundColor: '#007bff',
        alignSelf: 'center',
        borderRadius: 10,
        marginTop: windowHight * 0.03,
        alignItems: 'center',
        justifyContent: 'center'
    },
    registerButton: {
        width: windowWidth * 0.85,
        height: windowHight * 0.075,
        backgroundColor: '#dc3545',
        alignSelf: 'center',
        borderRadius: 10,
        marginTop: windowHight * 0.03,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        color: 'white',
        fontSize: windowWidth * 0.06,
        fontWeight: '500'
    },
    resgisterText: {
        color: 'white',
        fontSize: windowWidth * 0.06,
        fontWeight: '500'
    }
})

export default Login;