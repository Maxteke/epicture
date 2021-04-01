import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { authorize } from 'react-native-app-auth'
import { AuthContext } from './context/context'
import { MainScreen } from './screens/Home'
import { Log } from './screens/Log'
import { Profile } from './screens/Profile'

const RootStack = createStackNavigator();
const Stack = createDrawerNavigator();

const config = {
  clientId: '41e92cea4126bfd',
  clientSecret: '3765581b992924545aa2d72f201f291b1fdd5224',
  redirectUrl: 'epicture://oauth',
  serviceConfiguration: {
    authorizationEndpoint: 'https://api.imgur.com/oauth2/authorize',
    tokenEndpoint: 'https://api.imgur.com/oauth2/token',
  }
};

async function AuthService() {
  try {
    const result = await authorize(config)
    return(result)
  }
  catch (err) {
    console.log(err)
  }
}

function Root() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={MainScreen} />
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  );
}

function App() {
  const [Auth, setAuth] = React.useState()
  var context = {
    connectImgur: () => {
      AuthService().then(res => setAuth(res)).catch(err => console.log(err))
    },
    auth: Auth,
    clientId: '41e92cea4126bfd'
  }
  return (
    <AuthContext.Provider value={context}>
      <NavigationContainer>
        <RootStack.Navigator>
          {Auth ? (
            <RootStack.Screen name="Root" component={Root} options={{ headerShown: false }} />
          ) : (
            <RootStack.Screen name="Log" component={Log} options={{ headerShown: false }} />
          )}
        </RootStack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

export default App;
