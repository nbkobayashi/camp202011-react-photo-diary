import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Image,
  Button,
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions
} from "react-native";

import { StackNavigationProp } from "@react-navigation/stack";
import * as ImagePicker from "expo-image-picker";

import { useFocusEffect } from "@react-navigation/native";
import { loadPictureInfoListAsync } from "./Store";
import moment from "moment";

const screenWidth = Math.round(Dimensions.get("window").width);

type Props = {
  navigation: StackNavigationProp<RootStackParamList, "Home">;
};

export default function HomeScreen({ navigation }: Props) {
  const [hasPermission, setHasPermission] = useState(false);
  const [pictureInfoList, setPictureInfoList] = useState<PictureInfo[]>([]);

  // アプリの初期化
  const initAppAsync = async () => {
    // カメラのアクセス権限を取得
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const cameraRollPermission = await ImagePicker.requestCameraRollPermissionsAsync();
    const granted = cameraPermission.granted && cameraRollPermission.granted;
    setHasPermission(granted);
  };

  // 画像リストをストレージから読み込み、更新する
  const updatePictureInfoListAsync = async () => {
    const newPictureInfoList = await loadPictureInfoListAsync();
    setPictureInfoList(newPictureInfoList.reverse());
  };

  // 初期化処理
  React.useEffect(() => {
    initAppAsync();
  }, []);

  // 画面遷移時の処理
  useFocusEffect(
    React.useCallback(() => {
      updatePictureInfoListAsync();
    }, [])
  );

  const renderPictureInfo = ({ item }: ListRenderItemInfo<PictureInfo>) => {
    return (
      <View style={styles.pictureInfoContainer}>
        <Text style={styles.pictureTitle}>{item.title}</Text>
        <Image style={styles.picture} source={{ uri: item.uri }} />
        <Text style={styles.timestamp}>
          撮影日時: {moment(item.createdAt).format("YYYY/MM/DD HH:mm:ss")}
        </Text>
      </View>
    );
  };

  const PictureDiaryList = () => {
    return (
      <FlatList
        data={pictureInfoList}
        renderItem={renderPictureInfo}
        keyExtractor={item => `${item.createdAt}`}
      />
    );
  };

  const UnPermission = () => {
    return <Text>カメラ及びカメラロールへのアクセス許可が有りません。</Text>;
  };

  return (
    <View style={styles.container}>
      {/* 権限が無かった時 */}
      {!hasPermission && <UnPermission />}
      {/* 権限が有った時 */}
      {hasPermission && <PictureDiaryList />}
      {hasPermission && (
        <Button
          title="to AddScreen"
          onPress={() => navigation.navigate("Add")}
        />
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  pictureInfoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 10,
    padding: 5,
    margin: 5
  },
  picture: {
    // 横の幅に合わせて3:4
    width: screenWidth * 0.8,
    height: (screenWidth * 0.8 * 4) / 3
  },
  pictureTitle: {
    fontSize: 30
  },
  timestamp: {
    fontSize: 15
  }
});
