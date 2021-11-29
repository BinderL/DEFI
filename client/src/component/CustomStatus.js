
import React from 'react'
import {TouchableOpacity, FlatList, StyleSheet, View, Text } from 'react-native'


const Item = ({ item, onPress, style }) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
    <Text style={styles.title}>{item.title}</Text>
  </TouchableOpacity>
);


const CustomStatus = (props) => {
  const renderItem = ({ item }) => {
    const backgroundColor = item.id === props.curentID ? "#6e3b6e" : "#f9c2ff";
    return (
      <Item
        item={item}
        onPress={() => {
          props.action(item.id);
          }
        }
        style={{ backgroundColor }}
      />
    );
  };
  return (
    <View style={[styles.main_container, props.style]}>
      <FlatList
        data={props.data}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        extraData={props.curentID}
        horizontal={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  main_container: {
    flex:1,
    marginTop: 5,
    flexDirection: "row",

  },
  item: {
    backgroundColor: '#f9c2ff',
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
  },
})

export default CustomStatus
