// credit https://github.com/Noamm9/NoammAddons-CT/blob/main/NoammAddons/AutoUpDater.js

// ファイル写し。
import "./index"

let rege = /^mikan-pi-chat-module-\w+$/

register("gameLoad", () => {
    test = JSON.parse(readfile("ChatMi", "data/data.json"))

        hash("mikan-pi", "chat-module", "main", (sha) => {
            if (test.sha !== sha) {  // sha をチェックする
                Update.start()
            }
        }) 
})

function deletefile() {
    FileLib.deleteDirectory(`${Config.modulesFolder}/${whatfileName()}`)
    FileLib.deleteDirectory(`${Config.modulesFolder}/ChatMi.zip`)
}

const File = Java.type("java.io.File")
const URL = Java.type("java.net.URL")
const PrintStream = Java.type("java.io.PrintStream")
const Byte = Java.type("java.lang.Byte")

function urlToFile(url, destination, connecttimeout, readtimeout) {
    const d = new File(destination)
    d.getParentFile().mkdirs()
    const connection = new URL(url).openConnection()
    connection.setDoOutput(true)
    connection.setConnectTimeout(connecttimeout)
    connection.setReadTimeout(readtimeout)
    const IS = connection.getInputStream()
    const FilePS = new PrintStream(destination)
    let buf = new Packages.java.lang.reflect.Array.newInstance(Byte.TYPE, 65536)
    let len
    while ((len = IS.read(buf)) > 0) {
        FilePS.write(buf, 0, len)
    }
    IS.close()
    FilePS.close()
}

const Update = new Thread(() => {
    try {
        urlToFile("https://api.github.com/repos/mikan-pi/chat-module/zipball", `${Config.modulesFolder}/ChatMi.zip`, 1000, 2000)
        ChatLib.chat(`download zip file! 1/5`)
        Thread.sleep(1000)

         // 解凍処理
        FileLib.unzip(`${Config.modulesFolder}/ChatMi.zip`, `${Config.modulesFolder}`)
        Thread.sleep(1000)
        ChatLib.chat(`unzip file! 2/5`)
        Thread.sleep(1000)

        replace()
        
    } catch (e) {ChatLib.chat(`error! :${e}`)}
})


function whatfileName() {
    let folder = new File(`${Config.modulesFolder}`);
    let files = folder.listFiles();

    if (files) {
        for (let file of files){
            if (file.getName().match(rege)) {
                // let readme = FileLib.read(file.getName());
                // FileLib.write("ChatMi", file.getName(), readme);
                // ChatLib.chat(`${file.getName()}`);
                return file.getName()
            }
        }
        return null
    } else {
        ChatLib.chat("フォルダが見つかりません");
    }
}

function readfolder(path) {
    ChatLib.chat(`${path}`);
    let folder = new File(path);
    let files = folder.listFiles();
    let igor = {
        ".git": true,
        ".gitignore": true,
        "autoupdate.js": true,
        "data": true,
        "image.png": true,
        "README.MD": true,

    };

    if (files) {
        let fileNames = [];
        for (let file of files) {
            if (!igor[file.getName()]) { // 除外リストに含まれない場合のみ追加
                fileNames.push(file.getName());
            }
        }
        return JSON.stringify(fileNames)
    } else {
        ChatLib.chat("フォルダが見つかりません");
        return null;
    }
}

function readfile(module, file) {
    return FileLib.read(module, file)
}

function replace() {
    let gitMi = Config.modulesFolder + "/" + whatfileName();
    let ChatMi = Config.modulesFolder + "/ChatMi";
    
    let cmi = readfolder(ChatMi);
    let gmi = readfolder(gitMi);

    if (cmi && gmi) {
        let cmiFiles = JSON.parse(cmi);
        let gmiFiles = JSON.parse(gmi);

        for (let count = 0; count < gmiFiles.length; count++) {
            let file = gmiFiles[count];

            if (cmiFiles.includes(file)) {
                let gmiContent = readfile(whatfileName(), file);

                if (gmiContent) {
                    ChatLib.chat(`[cmi] ${file} has been updated.`);
                    
                    // ダウンロードしたファイルを消去
                    deletefile()
                } 
            }
        }

    } else {
        console.log("[cmi/gmi] Error: Failed to read folder.");
        ChatLib.chat("[cmi/gmi] Error: Failed to read folder.");
    }
}

let item = {}

function hash(user, name, branch1, callback) {
    let url = `https://api.github.com/repos/${user}/${name}/commits/${branch1}`;
    
    ChatLib.chat(`URL: ${url} 1/4`);
    
    get(url, (error, response) => {
        if (error) {
            ChatLib.chat(`&cエラー: ${error}`);
            callback(null);  // エラーがある場合は null を返す
            return;
        }

        try {
            ChatLib.chat(`&aレスポンス: ${response} 2/4`);
            const jsonres = JSON.parse(response)
            console.log(jsonres)
            let commitSha = jsonres.sha;  // SHAを取得
            if (commitSha) {
                ChatLib.chat(`&b取得したSHA: ${commitSha} 3/4`);
                item.sha = commitSha

                FileLib.write(`ChatMi`, "data/data.json", JSON.stringify(item))
                callback(commitSha);  // 取得したSHAをcallbackで返す
            } else {
                ChatLib.chat("&cSHAが見つかりません");
                callback(null);
            }
        } catch (e) {
            ChatLib.chat(`&cJSON解析エラー: ${e}`);
            callback(null);
        }
    });
}

function get(path, callback) {
    var Runnable = Java.type("java.lang.Runnable");
    var Thread = Java.type("java.lang.Thread");

    var task = new Runnable({
        run: function() {
            try {
                var URL = Java.type("java.net.URL");
                var BufferedReader = Java.type("java.io.BufferedReader");
                var InputStreamReader = Java.type("java.io.InputStreamReader");
                var StringBuilder = Java.type("java.lang.StringBuilder");

                var url = new URL(path);
                var connection = url.openConnection();
                connection.setRequestMethod("GET");
                connection.setRequestProperty("User-Agent", "Mozilla/5.0");

                var reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                var response = new StringBuilder();
                var line;
                while ((line = reader.readLine()) !== null) {
                    response.append(line);
                }
                reader.close();
                console.log(JSON.parse(response))
                //console.log(response)
                callback(null, response);  // 文字列として渡す
            } catch (error) {
                callback(error, null);
            }
        }
    });

    new Thread(task).start(); // 別スレッドで実行
}