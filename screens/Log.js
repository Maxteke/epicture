import * as React from 'react';
import { View, TouchableOpacity, Text, Image, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/context'
import { styles } from '../StyleSheet/stylesheet'

export function Log() {
    const { connectImgur } = React.useContext(AuthContext)
    const [isLoading, setIsLoading] = React.useState(false)
    return (
        <View style={styles.container}>
            <Image style={styles.logo} source={require('./Imgur.png')}/>
            { isLoading ? <ActivityIndicator size="large" color="#2a2b2e" style={{ paddingTop: 40 }} /> : (
                <TouchableOpacity style={styles.button} title="Connect Imgur" onPress={() => {
                    setIsLoading(true)
                    connectImgur()
                    }}>
                    <Text>Log with imgur</Text>
                </TouchableOpacity>
            )}
        </View>
    )
}