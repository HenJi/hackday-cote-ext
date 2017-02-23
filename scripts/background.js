function sendMessageToTab(message) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    chrome.tabs.sendMessage(tabs[0].id, message);
  })
}

chrome.browserAction.onClicked.addListener(function(){
  sendMessageToTab({action:"toggle"})
});

chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.action == "source") {
    content = request.source;
    const page = $(content);
    const marque = $(page).find("h1")[0].textContent.split("\n")[1].trim().split("\t")[0]
    const modele = $(page).find("h3 > strong")[0].innerHTML;
    const version = $(page).find("h1 .versionTxt")[0].textContent;
    sendMessageToTab({
      action: "infos",
      data: { marque, modele, version }
    })
  }
});
