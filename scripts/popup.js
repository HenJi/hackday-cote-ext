var page;
var container;
var versions;
var carData;

function afficherCotes(container){
  return function(cotes) {
    console.dir(cotes);
    if (cotes) {
      const { cote_brute, cote_perso, price_new, year_mileage } = cotes;
      const { km, prix } = carData.annonce;
      $(container).html(
        coteBlock("Côte brute", cote_brute, `Pour un kilométrage annuel de :<br/>${printNum(year_mileage)} km`)
        + coteBlock("Côte affinée", cote_perso, `Pour un kilométrage de :<br/>${printNum(km)} km`)
      );
    } else
      $(container).html(
        coteBlock("Côte brute", "N/C", "Pas de côte disponible pour ce véhicule")
      );
  }
}

function selectMission() {
  const version = $("#finition")[0].value;
  const { marque, modele, millesime } = carData.voiture;
  const { km, prix } = carData.annonce;
  getCotes(marque, modele, version, millesime, km, 6)(afficherCotes("#results"));
}

function selectVersions(versions) {
  var html = '<div class="selectFinition"><select id="finition"><option value="">Sélectionnez une finition</option>'
  for(var i = 0; i < versions.length; i++) {
    html = html + `<option value="${versions[i]}">${versions[i]}</option>`
  }
  html = html + '</select></div>'
 return html
}

function printNum(i) {
  return i.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function coteBlock(title, prix, kmText) {
  return (
    `<div class="cote-info">`
    + `<div class="cote-data">`
      + `<p class="title">${title}</p> `
      + `<p class="km">${kmText}</p>`
    + `</div>`
    + `<div class="cote-prix">${printNum(prix)} €</div>`
  + `</div>`
  )
}

chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.action == "source") {
    page = parseHtml(request.source);
    carData = buildData(request.host, page);
    const { marque, modele, version, millesime } = carData.voiture;
    const { km, prix } = carData.annonce;
    if (!version) {
      getVersions(marque, modele, millesime)(function(versions){
        $(container).html(
          selectVersions(versions) + '<div id="results"></div>'
        )
        $("#finition").change(selectMission);
      })
    } else {
      const mois = parseInt(carData.annonce.miseEnCirculation.split("/")[1].trim())
      getCotes(marque, modele, version, millesime, km, mois)(afficherCotes("#container"));
    }
  }
});

function onWindowLoad() {

  container = $("#container")

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
  if (host === "www.lacentrale.fr") { return LACENTRALE.parseData(page)
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
