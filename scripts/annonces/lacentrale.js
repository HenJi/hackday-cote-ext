var LACENTRALE = (function () {

  function getAnnonces(marque, modele, anneeMin, anneeMax, version) {
    return (cb) => {
      const base = "http://www.lacentrale.fr/listing_auto.php";
      const url = version ? base : base + `?version=${version}`;
      return $.get(url, {tri:"VE_MILEAGE", sens:1, marque, modele, annee:anneeMin, annee2:anneeMax}).then(function(content){
        const data = parseHtml(content);
        const nb = $(data).find(".numAnn")[0].textContent;
        console.log(nb+" annonces lacentrale");
        const { annonces, moyenne } = getDetailAnnonces(data);
        cb({ nb, annonces, moyenne });
      })
    }
  }

  function getDetailAnnonces(data) {
    const htmlPrices = $(data).find(".fieldPrice nobr");
    const annonces = [];
    for (var i=0; i<htmlPrices.length; i++) {
      if (htmlPrices[i]) annonces.push(parseInt(htmlPrices[i].textContent.replace(/ /g, "")));
    }
    return { annonces, moyenne:computeAverage(annonces) };
  }

  function parseData(page) {
    const marque = $(page).find("h1")[0].textContent.split("\n")[1].trim().split("\t")[0]
    const modele = $(page).find("h3 > strong")[0].textContent;
    const version = $(page).find("h1 .versionTxt")[0].textContent;
    const prix = parseInt($(page).find(".mainInfos .floatR strong")[0].textContent.replace(/ /g, ""));
    const getInfoText = (key) => {
      const h4 = $(page).find(`.infoGeneraleTxt > *:contains('${key}')`)
      if (h4.length > 0) return h4[0].nextSibling.nextSibling.textContent.trim();
      else return "";
    }
    const millesime = parseInt(getInfoText("Année"));
    const km = parseInt(getInfoText("Kilométrage"));
    const miseEnCirculation = getInfoText("Mise en circulation");
    const premiereMain = getInfoText("Première main");
    const voiture = { marque, modele, version, millesime };
    const annonce = { km, premiereMain, prix, miseEnCirculation };
    console.dir( { voiture, annonce } )
    return { voiture, annonce };
  }

  return {
    getAnnonces,
    parseData
  };
}());
