import React, { useEffect, useState } from "react";
import {
    View, Text, FlatList, StyleSheet, Dimensions,
    TouchableOpacity, Image, ActivityIndicator, RefreshControl, Alert
} from "react-native";
import Logout from "react-native-vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import NetInfo from "@react-native-community/netinfo";

const windowH = Dimensions.get('window').height;
const windowW = Dimensions.get('window').width;

const apiKey = "ef120436ee234aafbe35cafad9ffb628";
const pageSize = 10;

const Listing = ({ navigation }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchData = async (reset = false) => {
        const netState = await NetInfo.fetch();
        try {
            
            if (!netState.isConnected) {
                console.log(".............");
                const cacheData = await AsyncStorage.getItem("cacheData");
                if (cacheData) {
                    setData(JSON.parse(cacheData));
                    console.log("here");
                } else {
                    Alert.alert("No cached data available.");
                }
                return;
            }

            if (reset) {
                setRefresh(true);
                setPage(1);
            } else {
                setLoading(true);
            }

            const response = await axios.get(`https://newsapi.org/v2/top-headlines`, {
                params: {
                    country: 'us',
                    apiKey: apiKey,
                    page: reset ? 1 : page,
                    pageSize: pageSize
                }
            });

            const articles = response.data.articles;
            console.log(articles);

            if (reset) {
                setData(articles);
                await AsyncStorage.setItem("cacheData", JSON.stringify(articles));
            } else {
                const newData = [...data, ...articles];
                setData(newData);
                await AsyncStorage.setItem('cacheData', JSON.stringify(newData));
            }

            if (articles.length === 0) {
                setHasMore(false);
            } else {
                setHasMore(true);
                setPage(prev => prev + 1);
            }

        } catch (error) {
            console.error("Error fetching news:", error);
            Alert.alert("Failed to load news.");
        } finally {
            setLoading(false);
            setRefresh(false);
        }
    };

    const handleLogout = async () => {
        try {
            await AsyncStorage.clear();
            navigation.replace('Login');
        } catch {
            navigation.replace('Login');
        }
    };

    const handlePost = (item) => {
        navigation.navigate("Details", { postData: item });
    };

    useEffect(() => {
        fetchData(true);
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.postsText}>News</Text>
                <TouchableOpacity style={styles.logout} onPress={handleLogout}>
                    <Logout name="logout" size={windowW * 0.08} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={data}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.postcontainer} onPress={() => handlePost(item)}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.titleText} numberOfLines={1}>{item.title}</Text>
                        </View>
                        {item.urlToImage && (
                            <Image source={{ uri: item.urlToImage }} style={styles.image} resizeMode="cover" />
                        )}
                        <View style={styles.shortDiscriptionContainer}>
                            <Text style={styles.discriptionText} numberOfLines={2}>{item.description}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                onEndReached={() => hasMore && fetchData()}
                onEndReachedThreshold={0.5}
                refreshControl={
                    <RefreshControl refreshing={refresh} onRefresh={() => fetchData(true)} />
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
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        backgroundColor: '#F8F9FA',
        width: windowW,
        height: windowH * 0.08,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
    },
    postsText: {
        fontSize: windowW * 0.07,
        color: "#333333",
        fontWeight: '700'
    },
    postcontainer: {
        flexDirection: 'column',
        backgroundColor: "#F8F9FA",
        height: windowH * 0.3,
        width: windowW * 0.95,
        alignSelf: 'center',
        margin: windowW * 0.015,
        borderRadius: windowW * 0.03
    },
    titleContainer: {
        width: windowW * 0.9,
        height: windowH * 0.05,
        alignSelf: 'center',
        justifyContent: 'center'
    },
    image: {
        height: windowH * 0.18,
        width: windowW * 0.9,
        alignSelf: 'center'
    },
    titleText: {
        fontSize: windowW * 0.05,
        fontWeight: '700'
    },
    shortDiscriptionContainer: {
        width: windowW * 0.9,
        height: windowH * 0.05,
        alignSelf: 'center',
        justifyContent: 'center'
    },
    discriptionText: {
        fontSize: windowW * 0.035,
        textAlign: 'justify'
    },
    loadingLayout: {
        position: 'absolute',
        top: windowH * 0.08,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'white',
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
        right: windowW * 0.03,
    }
});

export default Listing;
