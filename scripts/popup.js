var page;
var message;

chrome.runtime.onMessage.addListener(function(request, sender) {
  console.log("Message reçu popup")
  console.dir(request)
  if (request.action == "source") {
    page = $(request.source);
    const data = buildData(request.host, page);
    const { marque, modele, version } = data.voiture;
    message.innerText = `Marque : ${marque}\nModèle : ${modele}\nVersion : ${version}`;
  }
});

function onWindowLoad() {

  message = document.querySelector('#message');

  chrome.tabs.executeScript(null, {
    file: "scripts/getPageSource.js"
  }, function() {
    // If you try and inject into an extensions page or the webstore/NTP you'll get an error
    if (chrome.runtime.lastError) {
      message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
    }
  });

}

window.onload = onWindowLoad;

function buildData(host, page) {
  if (host === "www.lacentrale.fr") {
    const marque = $(page).find("h1")[0].textContent.split("\n")[1].trim().split("\t")[0]
    const modele = $(page).find("h3 > strong")[0].textContent;
    const version = $(page).find("h1 .versionTxt")[0].textContent;
    const prix = parseInt($(page).find(".mainInfos .floatR strong")[0].textContent.replace(/ /g, ""));
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
