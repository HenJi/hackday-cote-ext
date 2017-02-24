var LACENTRALE = (function () {

  function getAnnonces(marque, modele, anneeMin, anneeMax, version) {
    return (cb) => {
      const base = "http://www.lacentrale.fr/listing_auto.php";
      const url = version ? base : base + `?version=${version}`;
      return $.get(url, {tri:"VE_MILEAGE", sens:1, marque, modele, annee, annee2}).then(function(content){
        const data = parseHtml(content);
        const nb = $(data).find(".numAnn")[0].textContent;
        console.log(nb+" annonces");
        const ( annonces, moyenne ) = getDetailAnnonces(data);
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
    const infos = $(page).find(".infoGeneraleTxt p");
    const millesime = parseInt(infos[0].textContent);
    const km = parseInt(infos[1].textContent.split(" "));
    const miseEnCirculation = infos[7].textContent;
    const premiereMain = infos[11] == "oui";
    const voiture = { marque, modele, version, millesime };
    const annonce = { km, premiereMain, prix, miseEnCirculation };
    return { voiture, annonce };
  }

  return {
    getAnnonces,
    parseData
  };
}());
