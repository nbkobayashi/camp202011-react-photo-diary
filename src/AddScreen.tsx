import { StatusBar } from "expo-status-bar";
import React, { useState, useRef } from "react";
import {
  Button,
  Image,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  Dimensions
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/FontAwesome";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

type Props = {
  navigation: StackNavigationProp<RootStackParamList, "Add">;
};
const screenWidth = Dimensions.get("screen").width;

export default function AddScreen({ navigation }: Props) {
  const [titleText, setTitleText] = useState("");
  const [pictureURI, setPictureURI] = useState("");
  const pictureURICache = useRef("");

  // カメラを起動して画像を取得する
  const takePictureFromCameraAsync = async () => {
    const result = await ImagePicker.launchCameraAsync({
      aspect: [3, 4],
      allowsEditing: true
    });
    if (result.cancelled) return;
    setPictureURI(result.uri);
    // useRefにも保存する
    pictureURICache.current = result.uri;
  };

  React.useEffect(() => {
    return () => {
      // キャッシュを削除
      if (pictureURICache.current !== "") {
        FileSystem.deleteAsync(pictureURICache.current, { idempotent: true });
      }
    };
  }, []);

  const Preview = () => {
    return <Image style={styles.preview} source={{ uri: pictureURI }} />;
  };

  const Camera = () => {
    return (
      <TouchableOpacity
        style={styles.cameraButton}
        onPress={takePictureFromCameraAsync}
      >
        <Icon name="camera" size={100} />
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        <KeyboardAvoidingView
          style={styles.titleInputConatiner}
          behavior={Platform.OS == "ios" ? "padding" : "height"}
        >
          <TextInput
            style={styles.titleInput}
            placeholder="タイトル"
            onChangeText={value => setTitleText(value)}
            maxLength={100}
          />
        </KeyboardAvoidingView>
        <View style={styles.previewContainer}>
          {pictureURI ? <Preview /> : <Camera />}
        </View>
        <Button title="to HomeScreen" onPress={() => navigation.goBack()} />
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  titleInputConatiner: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center"
  },
  titleInput: {
    flex: 0.9,
    color: "#000",
    fontSize: 20,
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: "#fff",
    padding: 3
  },
  cameraButton: {
    width: screenWidth * 0.8,
    height: (screenWidth * 0.8 * 4) / 3,
    borderRadius: 30,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center"
  },
  previewContainer: {
    flex: 7,
    justifyContent: "center",
    alignItems: "center"
  },
  preview: {
    width: screenWidth * 0.8,
    height: (screenWidth * 0.8 * 4) / 3
  }
});
