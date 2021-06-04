chrome.browserAction.onClicked.addListener(sendfunc);
function sendfunc(tab) {
  msg = { txtt: "execute" };
  chrome.tabs.sendMessage(tab.id, msg);
}
