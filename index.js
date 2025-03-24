/*
git add *
git commit -m ""
git push
*/
import "./ro_maji"
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

//　階段みたいに降りて調べてく
function jpchat(text) {
    if (containsJapaneseByCode(text)) {
        return text; // 日本語が含まれている場合は元のテキストをそのまま返す
    }

    let result = "";
    let count = 0;
    while (count < text.length) {
        let char1 = text[count];

        if (count + 1 < text.length && ro_maji[char1] && typeof ro_maji[char1] === "object") {
            let char2 = text[count + 1];

            if (count + 2 < text.length && ro_maji[char1][char2] && typeof ro_maji[char1][char2] === "object") {
                let char3 = text[count + 2];

                if (count + 3 < text.length && ro_maji[char1][char2][char3] && typeof ro_maji[char1][char2][char3] === "object") {
                    let char4 = text[count + 3];

                    if (count + 4 < text.length && ro_maji[char1][char2][char3][char4] && typeof ro_maji[char1][char2][char3][char4] === "object") {
                        let char5 = text[count + 4];

                        if (count + 5 < text.length && ro_maji[char1][char2][char3][char4][char5] && typeof ro_maji[char1][char2][char3][char4][char5] === "object") {
                            let char6 = text[count + 5];

                            if (ro_maji[char1][char2][char3][char4][char5][char6]) {
                                result += ro_maji[char1][char2][char3][char4][char5][char6];
                                count += 6;
                                continue;
                            }
                        }
                        if (ro_maji[char1][char2][char3][char4][char5]) {
                            result += ro_maji[char1][char2][char3][char4][char5];
                            count += 5;
                            continue;
                        }
                    }
                    if (ro_maji[char1][char2][char3][char4]) {
                        result += ro_maji[char1][char2][char3][char4];
                        count += 4;
                        continue;
                    }
                }
                if (ro_maji[char1][char2][char3]) {
                    result += ro_maji[char1][char2][char3];
                    count += 3;
                    continue;
                }
            }
            if (ro_maji[char1][char2]) {
                result += ro_maji[char1][char2];
                count += 2;
                continue;
            }
        }

        if (ro_maji[char1]) {
            result += ro_maji[char1];
        } else {
            result += char1;
        }
        count++;
    }
    return result;
}



function containsJapaneseByCode(text) {
    for (let i = 0; i < text.length; i++) {
        const code = text.charCodeAt(i);

        // ひらがな: U+3040 - U+309F
        // カタカナ: U+30A0 - U+30FF
        // 漢字: U+4E00 - U+9FFF（CJK統合漢字）
        if (
            (code >= 0x3040 && code <= 0x309F) || // ひらがな
            (code >= 0x30A0 && code <= 0x30FF) || // カタカナ
            (code >= 0x4E00 && code <= 0x9FFF)    // 漢字
        ) {
            return true;
        }
    }
    return false;
}


function obchat() {
    str = ""
    str +=( pname + "\n")
    while(true) {
        let mes = obj[pname].messages[0] 
        // ChatLib.chat(`${str.length}`)
        if (str.length >= 1000) break    // ChatLib.chat(`${i} time${mes.time} chat${mes.chat}`)
        let Translation = jpchat(mes.chat)
        if (containsJapaneseByCode(mes.chat)) {
            str +=( `${mes.time} ` + `${mes.chat} ` + "\n")
            // ChatLib.chat(`${mes.time} ` + `${mes.chat} ` + "\n")
        } else {
            let plus = `${mes.chat}(${Translation})`
            str +=( `${mes.time} ` + `${plus} ` + "\n")
            // ChatLib.chat(`${mes.time} ` + `${plus} ` + "\n")
        }
        obj[pname].messages.shift()
        if (obj[pname].messages.length === 0) break
    }
    // ChatLib.chat(`&e${str}`)
    return str
}
/*
register("command", () => {
    console.log(jpchat("tta"));  // った
console.log(jpchat("tte"));  // って
console.log(jpchat("tti"));  // っち
console.log(jpchat("tto"));  // っと
console.log(jpchat("ttu"));  // っつ
console.log(jpchat("ttya")); // っちゃ
console.log(jpchat("ttyo")); // っちょ
console.log(jpchat("ttye")); // っちぇ
console.log(jpchat("ttyi")); // っちぃ
console.log(jpchat("ttyu")); // っちゅ
}).setName("mi-test-1");
*/