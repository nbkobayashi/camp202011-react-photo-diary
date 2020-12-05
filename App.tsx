import React from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./src/HomeScreen";
import AddScreen from "./src/AddScreen";

// ナビゲーションでApp.d.tsで設定したRootStackParamListを読み込み
const Stack = createStackNavigator<RootStackParamList>();

// 各画面をStackで定義
export default () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "ホーム画面" }}
        />
        <Stack.Screen
          name="Add"
          component={AddScreen}
          options={{ title: "入力画面" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
// スタイルは削除
