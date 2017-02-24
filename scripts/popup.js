var page;
var message;

chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.action == "source") {
    page = parseHtml(request.source);
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
    const millesime = parseInt(infos[0].textContent);
    const km = parseInt(infos[1].textContent.split(" "));
    const miseEnCirculation = infos[7].textContent;
    const premiereMain = infos[11] == "oui";
    const voiture = { marque, modele, version, millesime };
    const annonce = { km, premiereMain, prix, miseEnCirculation };
    return { voiture, annonce };
  } else if (host === "www.leboncoin.fr") {
    const marque = $(page).find("[itemprop='brand']")[0].textContent.trim();
    const modele = $(page).find("[itemprop='model']")[0].textContent.trim();
    const prix = parseInt($(page).find(".item_price .value")[0].textContent.trim().replace(/ /g, ""));
    const millesime = $(page).find("[itemprop='releaseDate']")[0].textContent.trim();
    const km = parseInt($(page).find(".property:contains('Kilométrage')")[0].parentNode.childNodes[3].textContent.replace(/ /g, ""));
    const boite = $(page).find(".property:contains('de vitesse')")[0].parentNode.childNodes[3].textContent
    const voiture = { marque, modele, millesime };
    const annonce = { km, prix };
    return { voiture, annonce };
  }
};

function getCotes(marque, modele, version, millesime, km, mois) {
  return (cb) =>
    // On commence par appeler la page de cotation
    $.get(`http://www.lacentrale.fr/fiche_cote_auto_flat.php?version=${version}`, {marque, modele, millesime}).then(function(){
      // Ensuite on appelle le service de côte détaillée
      $.get("http://www.lacentrale.fr/cote_proxy.php", {km, mois}).then(function(content){
        cb(content)
      })
    })
}

function getVersions(marque, modele, millesime) {
  return (cb) =>
    $.get(`http://www.lacentrale.fr/cote-voitures-${marque}-${modele}--${millesime}-.html`).then(function(content){
    const data = parseHtml(content);
    const versions = $(data).find('.listingResult .listingResultLine h3');
    const res = [];
    for (var i = 0; i < versions.length; i++) {
        if (versions[i]) res.push(versions[i].textContent);
      }
      cb(res);
    })
}
