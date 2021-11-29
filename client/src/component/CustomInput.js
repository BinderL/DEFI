// Components/Search.js

import React from 'react'
import { StyleSheet, View, TextInput } from 'react-native'


const CustomInput = (props) => {


  return (
    <View style={styles.textInput_container}>
      <TextInput
        value={props.data}
        style={styles.textinput}
        placeholder={props.commentaire}
        onChangeText={(text) => {
          props.action(text);
          }
        }
        multiline={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  textInput_container: {
    flex:1
  },

  textinput: {
    marginLeft: 5,
    marginRight: 5,
    height: 300,
    borderColor: '#000000',
    borderWidth: 1,
    paddingLeft: 5,
    flex:1
  },
})

export default CustomInput;
