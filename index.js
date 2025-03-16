let obj = {};
let pname = Player.getName();
let flag = false;

register("chat", (Rank, name, message, event, ...args) => {
    const n = name;
    const c = message;
    const t = ( '00' + new Date().getHours().toString()).slice( -2 ) + ":" + ( '00' + new Date().getMinutes().toString()).slice( -2 )
    if (n === Player.getName()) {
        // プレイヤー名でデータを保持する
        obj[n] = obj[n] || { player: n, messages: [] }; // プレイヤーごとに messages を作成（もし存在しなければ）
        obj[n].messages.push({ chat: c, time: t });

        cancel(event); // イベントをキャンセルして他の処理を防ぐ
        ChatLib.chat(`[1] ${n} ${c}`);

        flag = true;
    }
}).setCriteria("Guild > ${rank} ${name}: ${message}");


register("step", () => {
    post(obj, (error, result) => {

        if (error) {
            console.error("[6] post関数内でエラーが発生しました:", error);
        } else {
            
        }
        
        ChatLib.chat(`${JSON.stringify(obj)}`)
    });
}).setFps(1).setDelay(10)

function post(obj, callback) {
    var Runnable = Java.type("java.lang.Runnable");
    var Thread = Java.type("java.lang.Thread");

    var task = new Runnable({
        run: function() {
            try {
                var URL = Java.type("java.net.URL");
                var BufferedReader = Java.type("java.io.BufferedReader");
                var InputStreamReader = Java.type("java.io.InputStreamReader");
                var StringBuilder = Java.type("java.lang.StringBuilder");

                var webhookUrl = "https://proxy-z750.onrender.com/proxy";
                let ob = obchat()
                var payload = {"content" : `${ob}`}; // obj を送信するデータとして設定\n${obj[pname].messages[0].chat} ${obj[pname].messages[0].time}
                ChatLib.chat(`&e${ob}`)  // 実際のWebhook URL
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
            } catch (error) {
                console.error("[12] proxyerror:", error +"(fake)");
                return callback()
            }
        }
    });

    new Thread(task).start();
}

function obchat() {
    str = ""
    str +=( pname + "\n")
    while(true) {
        let mes = obj[pname].messages[0] 
        ChatLib.chat(`${str.length}`)
        if (str.length >= 1000) break    // ChatLib.chat(`${i} time${mes.time} chat${mes.chat}`)
        str +=( `${mes.time} ` + `${mes.chat} ` + "\n")
        obj[pname].messages.shift()
        if (obj[pname].messages.length === 0) break
    }
    ChatLib.chat(`&e${str}`)
    return str
}
/*
register("command", () => {
    data.webhook = "";
    data.save();
    console.log("Webhook URLをクリアしました。");
}).setName("mi-test-1");

register("command", () => {
    data.guilde.length = 0;
    data.save();
    console.log("guildeデータをクリアしました。");
}).setName("mi-test-2");

register("command", () => {
    // data.guilde の内容をチャットで表示
    if (data.guilde && data.guilde.length > 0) {
        const content = data.guilde.map((entry) => {
            return `${entry.time} ${entry.Playername}: ${entry.chat}`;
        }).join("\n");

        // 内容をチャットで表示
        ChatLib.chat(`data.guilde の内容: \n${content}`);
    } else {
        ChatLib.chat("data.guilde にデータがありません。");
    }
}).setName("mi-test-3");
*/