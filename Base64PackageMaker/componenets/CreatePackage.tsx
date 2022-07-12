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
    TouchableOpacity
} from 'react-native';


import { Directory, JSFile } from '../Directory';

export default ({ setLogs, logs, eKey }: {eKey:string, logs: string[], setLogs: Function }) => {
    const [jsFilesPath, setJsFilesPath] = useState("D:\\Projects\\NovelManager\\NovelManager.app\\parser");
    const [packagePath, setPackagePath] = useState("D:\\Projects\\NovelManager-public\\parsers-container\\1.1.3");
    const createPackage = async () => {
        let lg = [];
        try {
            await setLogs([]);
            const directory = new Directory(jsFilesPath);
            const files = await directory.files();
            const encryptedFiles = [] as string[];
            for (let file of files) {
                try {
                    lg.push("encrypting: " + file.name);
                    encryptedFiles.push(await file.enCryptString(eKey));
                    await setLogs([...lg]);
                } catch (e) {
                    lg.push("failed: " + JSON.stringify(e));
                }
            }
            try {
                lg.push("Wting Package To: " + packagePath)
                await setLogs([...lg]);
                const pgs = new JSFile(packagePath, "package.pkg", encryptedFiles.join("&"))
                await pgs.write();
            } catch (e) {
                await setLogs([...logs, "failed: " + JSON.stringify(e)]);
                console.error(e);
            } finally {
                lg.push("Finished Wting Package To: " + packagePath)
                await setLogs([...lg]);
            }

        } catch (e) {
            console.log("Could not open directory", e)
        }
    }


    return (
        <>
            <View style={styles.form}>
                <Text> Js Files Path: </Text>
                <TextInput onChangeText={setJsFilesPath} value={jsFilesPath} />
            </View>
            <View style={styles.form}>
                <Text> Package Path: </Text>
                <TextInput onChangeText={setPackagePath} value={packagePath} />
            </View>
            <Button title='Create Package' onPress={() => createPackage()}></Button>
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