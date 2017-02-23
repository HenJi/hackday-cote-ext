var page; // Hack to be able to test from console

function sendMessageToTab(message) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    chrome.tabs.sendMessage(tabs[0].id, message);
  })
}

chrome.browserAction.onClicked.addListener(function(){
  sendMessageToTab({action:"toggle"});
});

chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.action == "source") {
    content = request.source;
    page = $(content);
    const data = buildData(request.host, page);
    data && sendMessageToTab({ action: "infos", data });
  }
});

function buildData(host, page) {
  if (host === "www.lacentrale.fr") {
    const marque = $(page).find("h1")[0].textContent.split("\n")[1].trim().split("\t")[0]
    const modele = $(page).find("h3 > strong")[0].textContent;
    const version = $(page).find("h1 .versionTxt")[0].textContent;
    const prix = parseInt($(page).find(".mainInfos .floatR strong").textContent.replace(/ /g, ""));
    const infos = $(page).find(".infoGeneraleTxt p");
    const annee = parseInt(infos[0].textContent);
    const km = parseInt(infos[1].textContent.split(" "));
    const miseEnCirculation = infos[7].textContent;
    const premiereMain = infos[11] == "oui";
    const voiture = { marque, modele, version, annee };
    const annonce = { km, premiereMain, prix, miseEnCirculation };
    return { voiture, annonce };
  } else if (host === "www.leboncoin.fr") {
    const marque = $(page).find("[itemprop='brand']")[0].textContent.trim();
    const modele = $(page).find("[itemprop='model']")[0].textContent.trim();
    const prix = parseInt($(page).find(".item_price .value")[0].textContent.trim().replace(/ /g, ""));
    const annee = $(page).find("[itemprop='releaseDate']")[0].textContent.trim();
    const km = parseInt($(page).find(".property:contains('Kilométrage')")[0].parentNode.childNodes[3].textContent.replace(/ /g, ""));
    const boite = $(page).find(".property:contains('de vitesse')")[0].parentNode.childNodes[3].textContent
    const voiture = { marque, modele, annee };
    const annonce = { km, prix };
    return { voiture, annonce };
  }
};
