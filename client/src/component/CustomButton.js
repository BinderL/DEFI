// Components/Search.js

import React from 'react'
import { StyleSheet, View, Button } from 'react-native'


const CustomButton = (props) => {
  return (
    <View style={[styles.buttonContainer, props.style]}>
      <Button
        style={styles.button}
        title={props.name}
        onPress={props.onPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({

  buttonContainer: {
    //alignSelf: "center",
    flex:1,
  },
  button: {

    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase"
  },
})

export default CustomButton;
