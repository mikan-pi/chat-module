/*
git add *
git commit -m ""
git push
*/
// 最初の文字が英語だと翻訳されてしまう。tesuてすと → tesuてすと(てすてすと)
import ro_maji from "./ro_maji";

let obj = {};
let pname = Player.getName();

register("chat", (Rank, name, message, event, ...args) => {
    const n = name;
    const c = message;
    const t = ( '00' + new Date().getHours().toString()).slice( -2 ) + ":" + ( '00' + new Date().getMinutes().toString()).slice( -2 )
    if (n === Player.getName()) {
        // プレイヤー名でデータを保持する
        obj[n] = obj[n] || { player: n, messages: [] }; // プレイヤーごとに messages を作成（もし存在しなければ）
        obj[n].messages.push({ chat: c, time: t });

    }
}).setCriteria("Guild > ${rank} ${name}: ${message}");

register("chat", (name, message, ...args) => {
    const n = name;
    const c = message;
    const t = ( '00' + new Date().getHours().toString()).slice( -2 ) + ":" + ( '00' + new Date().getMinutes().toString()).slice( -2 )
    if (n === Player.getName()) {
        // プレイヤー名でデータを保持する
        obj[n] = obj[n] || { player: n, messages: [] }; // プレイヤーごとに messages を作成（もし存在しなければ）
        obj[n].messages.push({ chat: c, time: t });

    }
}).setCriteria("Guild > ${name}: ${message}");

register("step", () => {
    post(obj, (error, result) => {

        if (error) {
            console.error("[6] post関数内でエラーが発生しました:", error);
        } else {
            
        }
        
        // ChatLib.chat(`${JSON.stringify(obj)}`)
    });
}).setFps(1).setDelay(10)

function post(obj, callback) {
    var Runnable = Java.type("java.lang.Runnable");
    var Thread = Java.type("java.lang.Thread");

    var task = new Runnable({
        run: function() {
            //try {
                var URL = Java.type("java.net.URL");
                var BufferedReader = Java.type("java.io.BufferedReader");
                var InputStreamReader = Java.type("java.io.InputStreamReader");
                var StringBuilder = Java.type("java.lang.StringBuilder");

                var webhookUrl = "https://proxy-z750.onrender.com/proxy";
                let ob = obchat()
                var payload = {"content" : `${ob}`}; // obj を送信するデータとして設定\n${obj[pname].messages[0].chat} ${obj[pname].messages[0].time}
                // ChatLib.chat(`&e${ob}`)  // 実際のWebhook URL
                var url = new URL(webhookUrl);
                var connection = url.openConnection();
                connection.setRequestMethod("POST");
                connection.setRequestProperty("Content-Type", "application/json");  // 送信するコンテンツタイプ
                connection.setDoOutput(true);

                var writer = new java.io.OutputStreamWriter(connection.getOutputStream(), "UTF-8");
                writer.write(JSON.stringify(payload));  // payload を JSON.stringify で文字列化して送信
                writer.close();

                var responseCode = connection.getResponseCode();

                var responseStream;
                if (responseCode === 200) {
                    responseStream = connection.getInputStream();  // 正常なレスポンス
                } else {
                    responseStream = connection.getErrorStream();  // エラーレスポンス
                }

                var reader = new BufferedReader(new InputStreamReader(responseStream));
                var response = new StringBuilder();
                var line;
                while ((line = reader.readLine()) !== null) {
                    response.append(line);
                }
                reader.close();

                var result = JSON.parse(response.toString());
                return callback()
            /*} catch (error) {
                console.error("[12] proxyerror:", error +"(fake)");
                return callback()
            }*/
        }
    });

    new Thread(task).start();
}

function containsJapaneseByCode(text) {
    const reja = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/g; // ひらがな、カタカナ、漢字の範囲を手動で指定
    return reja.test(text);
}

function convertWToWWW(text) {
    return text.replace(/w{2,}/g, `www`); // 'w' が2回以上連続する部分を 'www' に変換
}
/*
function objsine(text) {
    return text.replace(/([a-vz-zA-VZ])\1{3,}/g, (match, p1) => p1.repeat(2));
}

function nchanger(input) {
    // まず "nn" を "ん" に変換
    input = input.replace(/nn/g, "ん");

    // "n" の後に子音が続く場合は "ん" を挿入
    input = input.replace(/n([bcdfghjklmnpqrstvwxyz])/g, "ん$1");

    // (オプション) 変換後に英単語を戻す処理
    return input;
}
*/

// 一文字づつ降りて調べる。
// mikatanさん!!!
function jpchat(text) {
    // 最初にwが連続している部分をwwwに変換
    let result = convertWToWWW(text)
    // result = objsine(result)
    
    // 日本語が含まれていればそのまま返す
    if (containsJapaneseByCode(result)) {
        return result;
    }

    // ローマ字変換処理
    Object.keys(ro_maji).map((key) => {
        result = result.replaceAll(key, ro_maji[key]);
    });


    return result;
}

function obchat() {
    let str = "";
    str += (pname + "\n");

    while (true) {
        let mes = obj[pname].messages[0]
        if (str.length >= 1000) break;

        let Translation = jpchat(mes.chat)

        // 日本語が含まれている場合
        if (containsJapaneseByCode(mes.chat) || Translation === convertWToWWW(mes.chat)) {
            str += (`${mes.time} ${mes.chat} \n`);
            // ChatLib.chat(`${mes.time} ${mes.chat}`)
        } else {
            let plus = `${mes.chat}(${Translation})`;
            str += (`${mes.time} ${plus} \n`);
            // ChatLib.chat(`${mes.time} ${plus}`)
        }

        obj[pname].messages.shift();
        if (obj[pname].messages.length === 0) break;
    }
    return str;
}

register("command", () => {
    ChatLib.chat(`${jpchat("konnnitiwa")}`)
}).setName("mi-test-1");

