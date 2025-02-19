import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import auth from '@react-native-firebase/auth';

const windowHight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const Register = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [conformpassword, setConformpassword] = useState('');
    const [invalidEmail, setInvalidEmail] = useState('')
    const [weakpassword, setWeakpassword] = useState(false)
    const [retypepassword, setRetypepassword] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setInvalidEmail('');
        setRetypepassword(false);
        setWeakpassword(false);
    }, [email, password, conformpassword])

    const registerUser = () => {
        // Handles user registration using Firebase Authentication.
        // Ensures the entered password and confirm password match before proceeding.
        // If registration is successful, the user is redirected to the Login screen.
        // If an error occurs, appropriate messages are displayed based on the error type.
        setLoading(true);
        if (password === conformpassword) {
            auth()
                .createUserWithEmailAndPassword(email, password)
                .then(() => {
                    console.log('User account created & signed in!');
                    navigation.goBack('Login');
                    setLoading(false);
                })
                .catch(error => {
                    // Handle different types of authentication errors.
                    setLoading(false);
                    if (error.code === 'auth/email-already-in-use') {
                        console.log('That email address is already in use!');
                        setInvalidEmail('Email already registered!');
                    } else if (error.code === 'auth/invalid-email') {
                        console.log('That email address is invalid!');
                        setInvalidEmail('Invalid email');
                    } else if (error.code === 'auth/weak-password') {
                        console.log("weak password")
                        setWeakpassword(true);
                    } else if (error.code === "auth/network-request-failed") {
                        Alert.alert("No internet connection. Please check your network.");
                    } else {
                        Alert.alert("An unknown error occurred.");
                    }
                });
        } else {
            // If passwords do not match, show an error message.
            setLoading(false);
            setRetypepassword(true);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.textRegistration}>Registration</Text>
            <TextInput
                style={styles.forUsername}
                value={email}
                placeholder="Enter your email"
                placeholderTextColor="gray"
                onChangeText={(text) => {
                    setEmail(text);
                }}
            />
            <View style={styles.errorContainer}>
                {invalidEmail ? <Text style={styles.errorText}>{invalidEmail}</Text> : null}
            </View>
            <TextInput
                style={styles.forPassword}
                value={password}
                placeholder="Enter your Password"
                placeholderTextColor="gray"
                onChangeText={(text) => {
                    setPassword(text);
                }}
            />
            <View style={styles.errorContainer}>
                {weakpassword ? <Text style={styles.errorText}>Weak password</Text> : null}
            </View>
            <TextInput
                style={styles.forconfirmpassword}
                value={conformpassword}
                placeholder="Re-enter your password"
                placeholderTextColor="gray"
                onChangeText={(text) => {
                    setConformpassword(text);
                }}
            />
            <View style={styles.errorContainer}>
                {retypepassword ? <Text style={styles.errorText}>Re-type password</Text> : null}
            </View>
            <TouchableOpacity style={styles.loginButton} onPress={() => { registerUser() }}>
                {!loading ?
                    <Text style={styles.buttonText}>Register</Text>
                    : <ActivityIndicator size={'large'} color={'white'} />
                }
            </TouchableOpacity>
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
        paddingLeft: windowWidth * 0.04
    },
    forconfirmpassword: {
        width: windowWidth * 0.85, // Responsive width
        height: windowHight * 0.075,
        borderWidth: 2,  // Required for visible border
        borderColor: 'black',
        borderRadius: 10,
        paddingHorizontal: 10,
        fontSize: windowWidth * 0.04,
        alignSelf: 'center',
        paddingLeft: windowWidth * 0.04
    },
    loginButton: {
        width: windowWidth * 0.85,
        height: windowHight * 0.075,
        backgroundColor: '#007bff',
        alignSelf: 'center',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        color: 'white',
        fontSize: windowWidth * 0.06,
        fontWeight: '500'
    },
    textRegistration: {
        alignSelf: 'center',
        marginTop: windowHight * 0.152,
        fontSize: windowWidth * 0.07,
        fontWeight: '800',
        color: '#007bff'
    },
    errorContainer: {
        height: windowHight * 0.035,
        width: windowWidth * 0.85,
        alignSelf: 'center',
    },
    errorText: {
        color: 'red',
        marginLeft: windowWidth * 0.02,
        fontSize: windowWidth * 0.03,
        fontWeight: '400'
    }
})

export default Register;