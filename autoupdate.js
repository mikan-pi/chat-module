// credit https://github.com/Noamm9/NoammAddons-CT/blob/main/NoammAddons/AutoUpDater.js
import "./index"

const metadata = JSON.parse(FileLib.read("ChatMi", "metadata.json"));
const subdata = JSON.parse(FileLib.read("mikan-pi-chat-module-4960d27", "metadata.json"))

register("command", () => {
    Update.start()
}).setName("tesuto");

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
        let old = ""
        old = metadata.version
        ChatLib.chat(`${old}`)
        urlToFile("https://api.github.com/repos/mikan-pi/chat-module/zipball", `${Config.modulesFolder}/ChatMi.zip`, 1000, 2000)
        ChatLib.chat(`download zip file! 1/5`)
        Thread.sleep(1000)

         // 解凍処理
        FileLib.unzip(`${Config.modulesFolder}/ChatMi.zip`, `${Config.modulesFolder}`)
        Thread.sleep(1000)
        let Imnew = ""
        Imnew = subdata
        ChatLib.chat(`${Imnew}`)
        ChatLib.chat(`unzip file! 2/5`)
        Thread.sleep(1000)
        
        if (old !== Imnew) {
            FileLib.deleteDirectory(`${Config.modulesFolder}/ChatMi`)
            ChatLib.chat(`delete file! 3/5`)
            Thread.sleep(1000)
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
    FileLib.write(`ChatMi`, "data/data.json", )
}).setName("mi-test-4")

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
        console.log("aaaa")
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