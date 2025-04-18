// credit https://github.com/Noamm9/NoammAddons-CT/blob/main/NoammAddons/AutoUpDater.js
/*
register("Gameload", () => {
    Update.start()
})
*/
import "./index"

let item = {}

let rege = /^mikan-pi-chat-module-\w+$/

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

        urlToFile("https://api.github.com/repos/mikan-pi/chat-module/zipball/1-feature-auto-update", `${Config.modulesFolder}/ChatMi.zip`, 1000, 2000)
        ChatLib.chat(`download zip file! 1/5`)
        Thread.sleep(1000)

         // 解凍処理
        FileLib.unzip(`${Config.modulesFolder}/ChatMi.zip`, `${Config.modulesFolder}`)
        Thread.sleep(1000)
        ChatLib.chat(`unzip file! 2/5`)
        Thread.sleep(1000)
        hash("mikan-pi", "chat-module", "1-feature-auto-update", (sha) => {
            if (sha) {  // sha をチェックする
                if (sha !== JSON.parse(readfile("ChatMi", "data/data.json")).sha) {
                    replaceallfile()
                } else {
                    let gitMi = Config.modulesFolder + "/" + whatfileName();
                    ChatLib.chat(`このバージョンは最新版です！`)
                    FileLib.deleteDirectory(gitMi)
                    FileLib.deleteDirectory(`${Config.modulesFolder}/ChatMi.zip`)
                }
            }
        }); 
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
    let folder = new File(path);
    let files = folder.listFiles();

    let basePath = Config.modulesFolder + "/";
    let relativePath = path.replace(basePath, "");
    ChatLib.chat(`${relativePath}`); // ← こちらに変更

    let igorlist = JSON.parse(readfile(relativePath, "igor.json"))

    console.log(igorlist)

    if (files) {
        let fileNames = [];
        for (let file of files) {
            if (!igorlist[file.getName()]) { // 除外リストに含まれない場合のみ追加
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

function replacefile(module, tofile, content) {
    let f = FileLib.write(module, tofile, content)
    return f
}


function replaceallfile() {
    let gitMi = Config.modulesFolder + "/" + whatfileName();
    let ChatMi = Config.modulesFolder + "/ChatMi";
    // console.log("Reading ChatMi folder...");
    let cmi = readfolder(ChatMi);  // Get file list in ChatMi folder
    // console.log("Reading gmi folder...");
    let gmi = readfolder(gitMi);   // Get file list in gmi folder

    if (cmi && gmi) {
        // console.log("Parsing file lists...");
        let cmiFiles = JSON.parse(cmi);  // Convert ChatMi file names to an array
        let gmiFiles = JSON.parse(gmi);  // Convert gmi file names to an array
        // console.log("Parsing completed");

        // Process files that exist in both cmi and gmi folders
        for (let i = 0; i < gmiFiles.length; i++) {
            let file = gmiFiles[i];
            // console.log(`Processing: ${file} (${i + 1} / ${gmiFiles.length})`);
            if (cmiFiles.includes(file)) {
                // Get content of gmi file
                let gmiContent = readfile(whatfileName(), file);
                if (gmiContent) {
                    // console.log(`Content of ${file} retrieved, starting overwrite`);
                    // Overwrite file in ChatMi with gmi content
                    try {
                        replacefile("ChatMi", file, gmiContent);
                        FileLib.write(`ChatMi`, "data/data.json", JSON.stringify(item))
                        FileLib.deleteDirectory(gitMi)
                        FileLib.deleteDirectory(`${Config.modulesFolder}/ChatMi.zip`)
                    } catch (e) {
                        ChatLib.chat(`${e}`)
                        // エラーが発生したら消去
                        FileLib.deleteDirectory(gitMi)
                        FileLib.deleteDirectory(`${Config.modulesFolder}/ChatMi.zip`)
                    }

                }}}}
}


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
            // ChatLib.chat(`&aレスポンス: ${response} 2/4`);
            const jsonres = JSON.parse(response)
            console.log(jsonres.sha)
            let commitSha = jsonres.sha;  // SHAを取得
            if (commitSha) {
                // ChatLib.chat(`&b取得したSHA: ${commitSha} 3/4`);
                item.sha = commitSha

                // FileLib.write(`ChatMi`, "data/data.json", JSON.stringify(item))
                callback(commitSha);  // 取得したSHAをcallbackで返す
            } else {
                ChatLib.chat("&cSHAが見つかりません");
                callback(null);
            }
        } catch (e) {
            ChatLib.chat(`177行目です。&cJSON解析エラー: ${e}`);
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


// コマンド

// mi-test-demo
register("command", () => {
    ChatLib.chat(`${JSON.parse(readfile("ChatMi", "data/data.json")).sha}`)
}).setName("mi-test-demo");


// mi-test-9
register("command", () => {
    let gitMi = Config.modulesFolder + "/" + whatfileName();
    let ChatMi = Config.modulesFolder + "/ChatMi";
    ChatLib.chat(`cmi: ${readfolder(ChatMi)}`)
}).setName("mi-test-9")

// mi-test-6
register("command", () => {
    replaceallfile()
}).setName("mi-test-6");

// mi-test-3
register("command", () => {
    hash("mikan-pi", "chat-module", "main", (sha) => {
        if (sha) {  // sha をチェックする
            ChatLib.chat(`Commit SHA: ${sha}`);
        }
    });
}).setName("mi-test-3");