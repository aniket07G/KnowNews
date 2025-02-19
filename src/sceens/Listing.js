import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity, Image, ActivityIndicator, RefreshControl, Alert } from "react-native";
import { createClient } from "pexels";
import Logout from "react-native-vector-icons/AntDesign";

const windowHight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const client = createClient('twG9A45DTK2kHLU3qdio8UYvnk9MWwF2xJd60CryL0kD7e29DZLYJkBX');
const query = 'Nature';
let contain = {};
let endIndex = -1;

const Listing = ({ navigation }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(false);

    const initialise = (data) => {
        // Handles rendering data in chunks, enabling infinite scrolling behavior.
        // If the user scrolls near the bottom, more data is loaded in batches.
        // When triggered with `data = true`, it mimics a refresh effect.
        if (data) {
            setRefresh(true);
            setTimeout(() => {
                setRefresh(false);
                setLoading(true);
            }, 1500)
            endIndex = -1;
            setData(contain.slice(0, endIndex + 10));
            endIndex += 10
            setTimeout(() => {
                setLoading(false);
            }, 2000)
        } else {
            console.log("okk", data)
            if (endIndex < 99) {
                setData(contain.slice(0, endIndex + 10));
                endIndex += 10;
            } else {
                endIndex = -1;
                setData(contain.slice(0, endIndex + 10));
                endIndex += 10
            }
        }
    }

    const handleLogout = async () => {
        // Logs the user out by clearing stored session data and navigating to the Login screen.
        // If an error occurs while clearing data, the user is still redirected to Login.
        try {
            await AsyncStorage.clear();
            navigation.navigate('Login');
        } catch {
            navigation.navigate('Login');
        }
    }

    const handlePost = (data) => {
        // When user pressed any single post, it is taken to the details screen.
        navigation.navigate("Details", { postData: data });
    }

    useEffect(() => {
        // Runs once when the component mounts.
        // Fetches two sets of data: one for post titles and descriptions, another for images.
        // If both API calls succeed, the data is combined into a single structured array.
        const fetchData = async () => {
            try {
                const postsresponse = await fetch("https://jsonplaceholder.typicode.com/posts");
                const images80 = await client.photos.search({ query, per_page: 80 });
                const images20 = await client.photos.search({ query, page: 2, per_page: 20 });
                const posts = await postsresponse.json();
                let imagesArray = [];
                for (let i = 0; i < 80; i++) imagesArray.push(images80.photos[i].src.landscape)
                for (let i = 0; i < 20; i++) imagesArray.push(images20.photos[i].src.landscape)
                // Merges post data with corresponding images.
                contain = posts.map((item, index) => ({
                    id: item.id,
                    title: item.title,
                    body: item.body,
                    imageUrl: imagesArray[index]
                }));
                initialise(false); // This fuction is called with the false data
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                Alert.alert("An unknown error occurred.");
            }
        };
        fetchData();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.postsText}>Posts</Text>
                <TouchableOpacity style={styles.logout} onPress={() => handleLogout()}>
                    <Logout name='logout' size={windowWidth * 0.08} />
                </TouchableOpacity>
            </View>
            <FlatList
                data={data}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                    return (
                        <TouchableOpacity style={styles.postcontainer} key={item.id} onPress={() => handlePost(item)}>
                            <View style={styles.titleContainer} >
                                <Text style={styles.titleText} numberOfLines={1}>{item.title}</Text>
                            </View>
                            <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />
                            <View style={styles.shortDiscriptionContainer} >
                                <Text style={styles.discriptionText} numberOfLines={2}>{item.body}</Text>
                            </View>
                        </TouchableOpacity>
                    )
                }}
                onEndReached={() => initialise(false)}
                onEndReachedThreshold={0.5}
                refreshControl={
                    <RefreshControl refreshing={refresh} onRefresh={() => initialise(true)} />
                }
            />
            {loading && (
                <View style={styles.loadingLayout}>
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color="black" />
                    </View>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
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
        position: 'relative'
    },
    postsText: {
        fontSize: windowWidth * 0.07,
        color: "#333333",
        fontWeight: '700'
    },
    postcontainer: {
        flexDirection: 'column',
        backgroundColor: 'yellow',
        height: windowHight * 0.3,
        width: windowWidth * 0.95,
        alignSelf: 'center',
        margin: windowWidth * 0.015,
        backgroundColor: "#F8F9FA",
        borderRadius: windowWidth * 0.03
    },
    titleContainer: {
        width: windowWidth * 0.9,
        height: windowHight * 0.05,
        alignSelf: 'center',
        overflow: "hidden",
        justifyContent: 'center'
    },
    image: {
        height: windowHight * 0.18,
        width: windowWidth * 0.9,
        alignSelf: 'center'
    },
    titleText: {
        fontSize: windowWidth * 0.05,
        overflow: "hidden",
        fontWeight: '700'
    },
    shortDiscriptionContainer: {
        width: windowWidth * 0.9,
        height: windowHight * 0.05,
        alignSelf: 'center',
        overflow: "hidden",
        justifyContent: 'center'
    },
    discriptionTextText: {
        fontSize: windowWidth * 0.02,
        overflow: "hidden",
        textAlign: 'justify'
    },
    loadingLayout: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'white',
        marginTop: windowHight * 0.08,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loaderContainer: {
        transform: [{ scale: 1.8 }],
        justifyContent: 'center',
        alignItems: 'center'
    },
    logout: {
        position: 'absolute',
        right: windowWidth * 0.03,
    }
})

export default Listing;