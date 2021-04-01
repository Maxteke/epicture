import * as React from 'react';
import { View, FlatList, Text, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/context'
import { SearchBar, ThemeProvider, Card, Icon } from 'react-native-elements'
import { theme } from '../StyleSheet/ThemeContext'
import { styles } from '../StyleSheet/stylesheet'
import { set } from 'react-native-reanimated';
import { ScrollView } from 'react-native-gesture-handler';

const baseURL = {
    url: 'https://api.imgur.com/3/'
}

export function MainScreen() {
    const { auth, clientId } = React.useContext(AuthContext);
    const [ searchText, setSearchText] = React.useState('')
    const [gallery, setGallery] = React.useState([])
    const [Sort, setSort] = React.useState('viral')
    const [isLoading, setIsLoading] = React.useState(true)
    const [refreshing, setRefreshing] = React.useState(false);
    const AvailaibleSort = ["viral", "top", "time"]
    const getClientheader = {
        method: "GET",
        headers: { 'Authorization': 'Client-ID ' + clientId }
    }
    const postClientheader = {
        method: "POST",
        headers: { 'Authorization': 'Client-ID ' + clientId }
    }
    const getTokenHeader = {
        method: "GET",
        headers: { 'Authorization': 'Bearer ' + auth.accessToken }
    }
    const postTokenheader = {
        method: "POST",
        headers: { 'Authorization': 'Bearer ' + auth.accessToken }
    }

    function getGallery(url, search) {
        setRefreshing(true)
        fetch(url , getClientheader)
            .then(resp => resp.json())
            .then(json => {
                    const tmp = []
                    for (var i = 0; i < json.data.length; i++) {
                        if (json.data[i].images != null) {
                            if (json.data[i].images[0].type != "video/mp4") {
                                tmp.push(renderCard({ title: json.data[i].title, link: json.data[i].images[0].link, favorite: json.data[i].favorite_count, comment: json.data[i].comment_count, key: i }))
                            }
                        }
                    }
                    setGallery(tmp)
                })
                .catch(err => console.log(err))
                .finally(() => {
                    setIsLoading(false)
                    setRefreshing(false)
                });
    }

    function checkPriority(search) {
        if (search)
            getGallery(baseURL.url + 'gallery/search/' + Sort + '/?q=' + search, search)
        else
            getGallery(baseURL.url + 'gallery/hot/' + Sort, search)
    }

    React.useEffect(() => {
        checkPriority(searchText);
    }, [Sort, searchText])

    function renderSearchBar() {
        return (
            <ThemeProvider theme={theme}>
                <SearchBar
                    onChangeText={ (search) => {
                        setIsLoading(true)
                        setSearchText(search)
                        }}
                    placeholder='Images, #tag' value={searchText} />
            </ThemeProvider>
        );
    }

    function renderCard(item) {
        return (
            <Card containerStyle={{ width: 160, padding:0 }} key={item.key}>
                <Card.Title>{item.title}</Card.Title>
                <Card.Image style={{ padding: 10 }} source={{ uri: item.link }}/>
                <View style={{
                    alignItems: 'center',
                    flexDirection: "row-reverse",
                    paddingLeft: 10}}>
                    <Icon
                        style={{alignSelf: "center", paddingTop: 3}}
                        name="chatbox-ellipses-outline"
                        type="ionicon"
                        size={15}
                    />
                    <Text style={{ 
                        alignSelf: 'center',
                        fontSize: 10,
                        paddingRight:2,
                        paddingLeft: 10 }}>{item.comment}</Text>
                    <Icon
                        style={{ alignSelf: "center", paddingTop: 3 }}
                        name="heart-outline"
                        type="ionicon"
                        size={15}
                        />
                    <Text style={{
                        alignSelf: 'center',
                        fontSize: 10,
                        paddingRight: 2
                    }}>{item.favorite}</Text>
                </View>
            </Card>
        );
    }

    const onGalleryRefresh = React.useCallback(() => {
        checkPriority(searchText)
    }, []);

     function renderGallery() {
        return (
            <View style={{ alignItems: 'center', padding: 10 }}>
                <FlatList
                    contentContainerStyle= {{ alignItems: 'center'}}
                    numColumns={2}
                    data={gallery}
                    keyExtractor={({ item }, index) => index}
                    renderItem={({ item }) => (
                        item
                    )}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onGalleryRefresh}
                        />
                    }
                />
            </View>
        );
    }

    function renderSearchSelection() {
        return (
            <View style={styles.ContainerRow}>
                {AvailaibleSort.map((value) => (
                    <TouchableOpacity
                        key={value}
                        onPress={() => {
                            setIsLoading(true)
                            if (value != Sort)
                                setSort(value)
                            else
                                checkPriority(searchText)
                        }}
                        style={[
                            styles.ButtonRow,
                            Sort === value && styles.selected,
                        ]}>
                        <Text
                            style={[
                                styles.buttonLabel,
                                Sort === value && styles.selectedLabel,
                            ]}>
                            {value}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    }

    return (
        <View>
            {renderSearchBar()}
            {renderSearchSelection()}
            {isLoading ? (
                <ActivityIndicator size="large" color="#2a2b2e" style={{paddingTop: 40}}/>
            ) : renderGallery()
            }
        </View>
    );
}