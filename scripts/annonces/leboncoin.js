
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
