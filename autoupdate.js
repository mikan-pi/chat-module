// credit https://github.com/Noamm9/NoammAddons-CT/blob/main/NoammAddons/AutoUpDater.js

// ファイル写し。
import "./index"

let old = ""
let Imnew = ""

let rege = /^mikan-pi-chat-module-\w+$/

register("command", () => {
    old = item.sha

    hash("mikan-pi", "chat-module", "main", (sha) => {
        if (sha) {  // sha をチェックする
            Update.start()
        } else {
            ChatLib.chat("失敗");
        }
    })
}).setName("mi-test-demo");

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

        if (old !== Imnew) {


        } 

        urlToFile("https://api.github.com/repos/mikan-pi/chat-module/zipball", `${Config.modulesFolder}/ChatMi.zip`, 1000, 2000)
        ChatLib.chat(`download zip file! 1/5`)
        Thread.sleep(1000)

         // 解凍処理
        FileLib.unzip(`${Config.modulesFolder}/ChatMi.zip`, `${Config.modulesFolder}`)
        Thread.sleep(1000)
        ChatLib.chat(`unzip file! 2/5`)
        Thread.sleep(1000)
        return
        
        if (old !== Imnew) {
            /*
            FileLib.deleteDirectory(`${Config.modulesFolder}/ChatMi`)
            ChatLib.chat(`delete file! 3/5`)
            Thread.sleep(1000)
            */
        } else {
            FileLib.deleteDirectory(`${Config.modulesFolder}/mikan-pi-chat-module-4960d27`)
            FileLib.deleteDirectory(`${Config.modulesFolder}/ChatMi.zip`)
            ChatLib.chat(`現在のChatMiのバージョンは最新版です。`)
            Thread.sleep(1000)
            return
        }

        const unzippedDir = new File(`${Config.modulesFolder}/mikan-pi-chat-module-4960d27`) // 解凍したらよくわからん名前になる。
        const newDir = new File(`${Config.modulesFolder}/ChatMi`)
        unzippedDir.renameTo(newDir)
        ChatLib.chat(`rename directory! 4/5`)
        Thread.sleep(1000)

        FileLib.deleteDirectory(`${Config.modulesFolder}/ChatMi.zip`)
        ChatLib.chat(`delete zip file! "/ct load" 5/5`)
        Thread.sleep(1000)
        ChatLib.command("ct load", true)
        
        
    } catch (e) {ChatLib.chat(`error! :${e}`)}
})

register("command", () => {
}).setName("mi-test-copy");

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

function replacefile(module, tofile, content) {
    let f = FileLib.write(module, tofile, content)
    return f
}

register("command", () => {
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
                    // replacefile("ChatMi", file, gmiContent);
                    ChatLib.chat(`[cmi] ${file} has been updated.`);
                } else {
                    // console.log(`[Error] ${file} is empty or cannot be read.`);
                    // ChatLib.chat(`[Error] ${file} is empty or cannot be read.`);
                }
            } else {
                // console.log(`${file} does not exist in cmi folder`);
            }
        }

        // console.log("Processing completed");
    } else {
        console.log("[cmi/gmi] Error: Failed to read folder.");
        ChatLib.chat("[cmi/gmi] Error: Failed to read folder.");
    }
}).setName("mi-test-6");

let item = {}

register("command", () => {
    hash("mikan-pi", "chat-module", "main", (sha) => {
        if (sha) {  // sha をチェックする
            ChatLib.chat(`Commit SHA: ${sha}`);
        } else {
            ChatLib.chat("SHAの取得に失敗しました");
        }
    });
}).setName("mi-test-3");

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
            Imnew = commitSha
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