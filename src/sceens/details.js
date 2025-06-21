import React from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Image } from "react-native";
import Back from "react-native-vector-icons/FontAwesome6";
import Logout from "react-native-vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";

const windowHight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const Details = ({ route, navigation }) => {
    const postData = route.params.postData;
    console.log("postData", postData);

    const handleLogout = async () => {
        try {
            await AsyncStorage.clear();
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        } catch {
            navigation.replace('Login');
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.arroback} onPress={() => navigation.goBack('Listing')}>
                    <Back name='arrow-left-long' size={windowWidth * 0.08} />
                </TouchableOpacity>
                <Text style={styles.detailsText}>Details</Text>
                <TouchableOpacity style={styles.logout} onPress={() => handleLogout()}>
                    <Logout name='logout' size={windowWidth * 0.08} />
                </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                <View style={styles.content}>
                    <Text style={styles.titleText}>{postData.title}</Text>
                    <Image source={{ uri: postData.urlToImage }} style={styles.image} resizeMode="contain" />
                    <Text style={styles.discriptionText}>{postData.description}</Text>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        backgroundColor: 'grey',
        width: windowWidth,
        height: windowHight * 0.08,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#F8F9FA",
        flexDirection: 'row',
        position: 'relative'
    },
    arroback: {
        position: 'absolute',
        left: windowWidth * 0.03,
    },
    logout: {
        position: 'absolute',
        right: windowWidth * 0.03,
    },
    detailsText: {
        fontSize: windowWidth * 0.07,
        color: "#333333",
        fontWeight: '700'
    },
    content: {
        flex: 1,
        padding: 15
    },
    image: {
        height: windowHight * 0.3,
        width: windowWidth * 0.91,
        alignSelf: 'center',
        // marginTop: windowHight*0.015
    },
    titleText: {
        fontSize: windowWidth * 0.07,
        fontWeight: '700'

    },
    discriptionText: {
        fontSize: windowWidth * 0.09,
        fontWeight: '400'

    }
})

export default Details;