import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center',
        paddingVertical: 20
    },
    button: {
        width: 200,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: '#0099cc'
    },
    logo: {
        width: 200,
        height: 200,
    },
    row: {
        padding: 4,
        width: "100%",
        alignItems: 'center',
        flexDirection: "row"
    },
    ContainerRow: {
        paddingTop: 5,
        alignSelf: "center",
        flexDirection: "row",
        flexWrap: "wrap"
    },
    ButtonRow: {
        paddingVertical: 6,
        alignSelf: "flex-start",
        marginBottom: 6,
        minWidth: "33%",
        textAlign: "center",
        alignItems: "center",
        backgroundColor: "#e3f2fc",
        borderWidth: 0.2,
        borderColor: '#fff'
    },
    selected: {
        backgroundColor: "#cdcfd1",
        borderWidth: 0,
    }
})