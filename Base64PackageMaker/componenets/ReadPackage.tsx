import * as React from 'react';
import { useState, useEffect } from 'react';

import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
    TextInput,
    Button,
    ActivityIndicator
} from 'react-native';
const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(() => {
    resolve();
}, ms))

import { Directory, JSFile, deCryptString } from '../Directory';

export default ({ setLogs, logs, eKey }: {eKey:string, logs: string[], setLogs: Function }) => {
    const [packagePath, setPackagePath] = useState("D:\\Projects\\NovelManager-public\\parsers-container\\1.1.3\\package.pkg");
    const [loading, setLoading] = useState(false)
    const readPackage = async () => {
        try {
            await setLoading(true);
            const file = new JSFile(packagePath, "package.pkg");
            const contents = (await file.read()).split("&");
            var lg = []
            let i = 0;
            for (let content of contents) {
                try {
                    const dContent = await deCryptString(eKey, content);
                  
                    lg.push(dContent)
                    await setLogs([...lg]);
                    await sleep(500)
                } catch (e) {
                    await setLogs([...logs, "failed: " + JSON.stringify(e)]);
                }
                i++;
            }


        } catch (e) {
            await setLogs([...logs, "failed: " + JSON.stringify(e)]);
        }finally{
            await setLoading(false);
        }


    }


    return (
        <>
            <View style={styles.form}>
                <Text> Package Path: </Text>
                <TextInput onChangeText={setPackagePath} value={packagePath} />
            </View>
            <View style={{justifyContent:"center", width:"100%"}}>
   
                <Button title='Read Package' onPress={readPackage}></Button>
                {
                    loading? (<ActivityIndicator style={{position:"absolute", zIndex:9, left:"50%"}} size="large" color={"red"} />): null
                }


            </View>
         
        </>
    )
}

const styles = StyleSheet.create({
    form: {
        width: "100%",
        justifyContent: "center",
        padding: 10
    }
});