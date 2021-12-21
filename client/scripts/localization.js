const curLang = window.navigator.language

// languages table
const languages = ["zh-CN", "en-US"]
const fields = {
    "install": {
        mode: "title",
        value: ["安装 Snapdrop", "Install Snapdrop"]
    },
    "notification": {
        mode: "title",
        value: ["开启消息通知", "Enable Notifications"]
    },
    "theme": {
        mode: "title",
        value: ["切换 明亮/黑暗 主题", "Switch Darkmode/Light mode"]
    },
    "language": {
        mode: "title",
        value: ["切换语言", "Switch Language"]
    },
    "about-icon": {
        mode: "title",
        value: ["关于 Snapdrop", "About Snapdrop"]
    },
    "scanning-tip": {
        mode: "innerHTML",
        value: ["在其他设备打开 Snapdrop 以传输文件", "Open Snapdrop on other devices to send files"]
    },
    "displayName": {
        mode: "innerHTML",
        value: ["跨平台传输文件的极简方案", "The easiest way to transfer data across devices"]
    },
    "displayNameBottom": {
        mode: "innerHTML",
        value: ["你可以被局域网内的任意设备发现", "You can be discovered by everyone on this network"]
    },
    "receiveFileTitle": {
        mode: "innerHTML",
        value: ["接收文件", "File Received"]
    },
    "fileName": {
        mode: "innerHTML",
        value: ["文件名", "Filename"]
    },
    "confirmAutoDownload": {
        mode: "innerHTML",
        value: ["在下载每个文件前都询问", "Ask to save each file before downloading"]
    },
    "download": {
        mode: "innerHTML",
        value: ["保存", "Save"]
    },
    "ignore": {
        mode: "innerHTML",
        value: ["忽略", "Ignore"]
    },
    "sendMessageTitle": {
        mode: "innerHTML",
        value: ["发送消息", "Send a Message"]
    },
    "textInput": {
        mode: "placeholder",
        value: ["消息内容", "Send a message"]
    },
    "sendButton": {
        mode: "innerHTML",
        value: ["发送", "Send"]
    },
    "cancel": {
        mode: "innerHTML",
        value: ["取消", "Cancel"]
    },
    "receiveTextTitle": {
        mode: "innerHTML",
        value: ["收到消息", "Message Received"]
    },
    "copy": {
        mode: "innerHTML",
        value: ["复制", "Copy"]
    },
    "close": {
        mode: "innerHTML",
        value: ["关闭", "Close"]
    },
    "toast": {
        mode: "innerHTML",
        value: ["文件传输完成", "File Transfer Completed"]
    },
    "slogan": {
        mode: "innerHTML",
        value: ["跨平台传输文件的极简方案", "The easiest way to transfer files across devices"]
    }
}

// Determine whether need to modify the language
let curLangIndex = null
const changeLang = () => {
    curLangIndex = languages.indexOf(curLang)
    if (curLangIndex !== -1) {
        doChange(curLangIndex)
    } else  {
        changeLang(1)
    }
}

const doChange = (index) => {
    for(let key in fields) {
        document.getElementById(key)[fields[key].mode] = fields[key].value[index]
    }
}

changeLang()

const btnLanguage = document.getElementById('language');
btnLanguage.addEventListener('click', function() {
    if (curLangIndex !== 1) {
        doChange(1)
        curLangIndex = 1
    } else {
        changeLang()
    }
})