/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import * as React from 'react';
import { useState } from 'react';

import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
  LogBox,
  TextInput
} from 'react-native';

import CreatePackage from './componenets/CreatePackage';
import ReadPackage from './componenets/ReadPackage';


const App = () => {
  //LogBox.ignoreAllLogs(); //Ignore all log notifications
  const [logs, setLogs] = useState([""]);
  const [operation, setOperation] = useState("Create Package" as "Create Package" | "Read Package");
  const [key, setKey] = useState("Encryption");
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: "row" }}>
        <Button title='Create Package' onPress={() => setOperation("Create Package")} />
        <Button title='Read Package' onPress={() => setOperation("Read Package")} />
      </View>
      <Text style={{ fontSize: 16, fontWeight: "bold" , paddingLeft:10}}>{operation}:</Text>
      
      <View style={styles.form}>
                <Text> Encryption Key: </Text>
                <TextInput onChangeText={setKey} value={key} />
            </View>
      {
        operation == "Create Package" ? (<CreatePackage logs={logs} setLogs={setLogs} eKey={key} />) : (<ReadPackage logs={logs} setLogs={setLogs} eKey={key} />)
      }

      <View style={styles.console}>
        <ScrollView style={{flex:1, maxWidth:"100%"}} showsVerticalScrollIndicator={true}>
          {
            logs.map((x, i) => (<Text key={i} style={styles.consoleText}> {x} </Text>))
          }
        </ScrollView>
      </View>
    </View >
  )
};

const styles = StyleSheet.create({
  form: {
    width: "100%",
    justifyContent: "center",
    padding: 10
  },
  console: {
    flex: 1,
    backgroundColor: "black",
    minHeight: 100,
    width: "98%",
    margin: 10,

  },
  consoleText: {
    color: "green",
    padding: 5,
    paddingBottom: 0
  }
});

export default App;
