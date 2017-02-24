var LEBONCOIN = (function () {

  // Entry point
  function getAnnonces(marque, modele, anneeMin, anneeMax) {
    return (cb) => {
      const marqueArg = upperCaseFirst(marque);
      const modeleArg = upperCaseFirst(modele);
      const url = `https://www.leboncoin.fr/voitures/offres/?th=1&parrot=0&rs=${anneeMin}&re=${anneeMax}&brd=${marqueArg}&mdl=${modeleArg}`;
      $.get(url).then(function(content) {
        // hmtl content to parse
        const data = $(content);
        const total = $(data).find("span.tabsSwitchNumbers").first().text();
        const items = $(data).find("a.list_item").toArray().map((item) => {
          const title = $($(item).find('h2.item_title')).text().trim();
          const price = parseInt($($(item).find('h3.item_price')).attr('content'));
          const date = $($(item).find('p.item_supp')).attr('content');
          console.log($(item).find('h2.item_title').textContent);
          return {
            titre: title,
            prix: price,
            dateParution: date
          };
        }).filter((item) => item.prix);
        const mean = Math.floor(items.reduce((acc, x) => acc + x.prix, 0) / items.length);
        const result = {
          moyenne: mean,
          annonces: items,
          nb: total
        };
        console.log(result);
        cb(result);
      });
    }
  }

  function parseData(page) {
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

  //getAnnonces("AUDI", "a1", 2000, 2017)

  return {
    getAnnonces,
    parseData
  };

}());
