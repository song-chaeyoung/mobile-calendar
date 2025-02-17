import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as ImagePicker from "expo-image-picker";

const Profile = () => {
  const [img, setImg] = useState<string | null>(null);

  const selectImg = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permission.granted) {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImg(result.assets[0].uri);
      }
    } else {
      console.log("사진권한 없음");
    }
  };

  console.log(img);
  return (
    <View style={styles.container}>
      <View style={styles.imgContainer}>
        {img === null ? (
          <View style={styles.nullImg}></View>
        ) : (
          <Image style={styles.img} src={img} />
        )}
        <TouchableOpacity style={styles.photoSelectBtn} onPress={selectImg}>
          <Text>사진 선택</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.textContainer}>
        <View style={styles.textWrapper}>
          <Text style={styles.profileTextTitle}>이름 :</Text>
          <Text style={styles.profileText}>000</Text>
        </View>
        <View style={styles.textWrapper}>
          <Text style={styles.profileTextTitle}>직급 :</Text>
          <Text style={styles.profileText}>000</Text>
        </View>
        <View style={styles.textWrapper}>
          <Text style={styles.profileTextTitle}>하는일 :</Text>
          <Text style={styles.profileText}>000</Text>
        </View>
        <View style={styles.textWrapper}>
          <Text style={styles.profileTextTitle}>근무지 :</Text>
          <Text style={styles.profileText}>000</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imgContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  photoSelectBtn: {
    borderWidth: 1,
    borderColor: "rgb(190,190,190)",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  nullImg: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgb(190,190,190)",
  },
  img: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  textContainer: {
    flex: 1,
    alignItems: "center",
    gap: 10,
  },
  textWrapper: {
    marginLeft: -30,
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  profileText: {
    fontSize: 20,
  },
  profileTextTitle: {
    fontSize: 20,
    width: 90,
    alignItems: "center",
    textAlign: "right",
  },
});

export default Profile;
