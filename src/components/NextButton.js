import React, { useEffect, useRef } from "react";
import {
  Animated,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const NextButton = ({ scrollTo }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => scrollTo()}
        style={{
          backgroundColor: "#00D2FF",
          paddingHorizontal: 25,
          paddingVertical: 10,
          borderRadius: 5,
          marginHorizontal: 3,
          alignSelf: "center",
        }}
      >
        <Text
          style={{
            textAlign: "center",
            color: "#fff",
            fontSize: 24,
            fontWeight: "500",
          }}
        >
          Welcome
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default NextButton;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
