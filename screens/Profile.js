import * as React from 'react';
import { View, ActivityIndicator, FlatList, RefreshControl, ScrollView } from 'react-native';
import { AuthContext } from '../context/context'
import { Image, Avatar, Text } from 'react-native-elements'
import { styles } from '../StyleSheet/stylesheet'
import { theme } from '../StyleSheet/ThemeContext'


const baseURL = {
    url: 'https://api.imgur.com/3/'
}

export function Profile() {
    const { auth } = React.useContext(AuthContext);
    const [imgs, setImgs] = React.useState([])
    const [avatar, setAvatar] = React.useState('')
    const [isImgsLoading, setImgsLoading] = React.useState(true);
    const [isAvatarLoading, setAvatarLoading] = React.useState(true);
    const [refreshing, setRefreshing] = React.useState(false);
    const [img, setImg] = React.useState([]);
    const getTokenHeader = {
        method: "GET",
        headers: { 'Authorization': 'Bearer ' + auth.accessToken }
    }
    const postTokenheader = {
        method: "POST",
        headers: { 'Authorization': 'Bearer ' + auth.accessToken }
    }
    function acountImages() {
        setRefreshing(true)
        fetch(baseURL.url + 'account/me/images/', getTokenHeader)
            .then(resp => resp.json())
            .then(json => {
                const tmp = []
                const imgtst = []
                for (var i = 0; i < json.data.length; i++) {
                    tmp.push(json.data[i].link)
                    imgtst.push(<Image
                            key={i}
                            source={{ uri: json.data[i].link }}
                            style={{ width: 115, height: 115, margin: 5 }}
                            PlaceholderContent={<ActivityIndicator color="#2a2b2e" style={{ paddingTop: 40 }} />}
                        />)
                }
                setImgs(tmp)
                setImg(imgtst)
            })
            .catch(err => console.log(err))
            .finally(() => {
                setImgsLoading(false)
                setRefreshing(false)
            });
    }

    function accountAvatar() {
        fetch(baseURL.url + 'account/me/avatar/', getTokenHeader)
            .then(resp => resp.json())
            .then(json => {
                setAvatar(json.data.avatar)
            })
            .catch(err => console.log(err))
            .finally(() => setAvatarLoading(false));
    }

    React.useEffect(() => {
        acountImages()
        accountAvatar()
    }, [])

    const onRefresh = React.useCallback(() => {
        acountImages();
    }, []);

    function renderImages() {
        return (
            <View style={{ flexDirection: "row", flexWrap: "wrap", alignSelf:'center' }}>
                {img}
            </View>
        );
    }

    return (
        <View>
            {
                isImgsLoading || isAvatarLoading ? <ActivityIndicator size="large" color="#2a2b2e" style={{ paddingTop: 40 }} /> : (
                    <View>
                        <View style={styles.row}>
                            <Avatar
                                rounded
                                source={{ uri: avatar }}
                                size={45}
                                title="M"
                                />
                            <Text style={{ alignSelf: 'center', fontSize: 20, padding: 10 }}>{auth.tokenAdditionalParameters.account_username}</Text>
                        </View>
                        <FlatList
                            contentContainerStyle={{ alignItems: 'center' }}
                            numColumns={2}
                            data={img}
                            keyExtractor={({ item }, index) => index}
                            renderItem={({ item }) => (
                                item
                            )}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}
                                />
                            }
                        />
                    </View>
                )
            }
        </View>
    );
}