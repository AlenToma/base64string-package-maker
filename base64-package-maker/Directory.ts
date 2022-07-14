import RNFS from 'react-native-fs'
import cryptoJs from 'crypto-js';
import { Base64 } from 'js-base64';

export const enCryptString = async (key: string, str: string) => {
    if (str.startsWith("#"))
        return str;
    str = cryptoJs.AES.encrypt(str, key).toString();
    str = Base64.encode(str);
    return "##" + str;
}

export const deCryptString = async (key: string, str: string) => {
    if (!str.startsWith("#"))
        return str;
    str = str.substring(2);
    str = Base64.decode(str);
    var bytes = cryptoJs.AES.decrypt(str, key);
    return bytes.toString(cryptoJs.enc.Utf8);
}

export class Directory {
    path: string;
    constructor(filePath: string) {
        this.path = filePath;
    }


    async files(serach?: string, directory?: string) {

        serach = serach || ".js"
        const result = [] as JSFile[];
        console.info("reading", directory || this.path)
        const files = await RNFS.readDir(directory || this.path);
        for (let path of files) {
            if (path.isDirectory()) {
                if (path.path.endsWith(".ts"))
                    continue;
                (await this.files(serach, path.path)).forEach(x => result.push(x));
            }
            else if (path.name.endsWith(serach)) result.push(new JSFile(path.path, path.name));
        }
        return result;
    }
}

export class JSFile {
    path: string;
    name: string;
    content?: string;
    fullPath?: boolean
    constructor(filePath: string, name: string, content?: string) {
        this.path = filePath;
        this.name = name;
        this.content = content;
        this.fullPath = content == undefined;
        if (!this.fullPath) {
            this.path += "\\" + name;
        }
    }

    async read() {
        console.log("Getting content")
        if (this.content)
            return this.content;
        return (this.content = await RNFS.readFile(this.path, 'utf8'))
    }

    async write() {
        console.log("Wring file")
        let str = await this.read();
        if (str) {
            if (await RNFS.exists(this.path))
                await RNFS.unlink(this.path);
            await RNFS.writeFile(this.path, str, 'utf8');
        }
    }

    async enCryptString(key: string) {
        let str = await this.read();
        return await enCryptString(key, str);
    }

    async deCryptString(key: string) {
        let str = await this.read();
        return await deCryptString(key, str);
    }
}

