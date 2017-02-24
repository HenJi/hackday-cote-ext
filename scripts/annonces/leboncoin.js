// Entry point
function getAnnonces(marque, modele, anneeMin, anneeMax) {
  const marqueArg = marque.toUppe
  const url = `https://www.leboncoin.fr/voitures/offres/?th=1&parrot=0&rs=${anneeMin}&re=${anneeMax}&brd=${marque}&mdl=${modele}`;
  $.get(url).then(function(content) {
    // hmtl content to parse 
    const data = $(content);
    const total = $(data).find("span.tabsSwitchNumbers").first().text();
    console.log(total)
    const results = $(data).find("a.list_item")
    console.log(results)
  });
}
