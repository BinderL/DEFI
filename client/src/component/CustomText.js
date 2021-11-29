
import React from 'react'
import { StyleSheet, View, Text } from 'react-native'


const CustomText = (props) => {
  return (
    <View style={[styles.textContainer, props.style]}>
      <Text style={[styles.text, props.style]} onPress={props.onPress}>
        {props.content}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({

  textContainer: {
    flex:1,
    //alignItems: 'center'
  },
  text: {
    fontSize: 25,
    color: "#000",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
})

export default CustomText;
