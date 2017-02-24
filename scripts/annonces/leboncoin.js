// Entry point
function getAnnonces(marque, modele, anneeMin, anneeMax) {
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
      annonces: items
    };
    console.log(result);
    return result;
  });
}

function upperCaseFirst(string) {
  if (string) {
    const head = string.substring(0, 1).toUpperCase();
    const tail = string.substring(1).toLowerCase();
    return head + tail;
  } else 
    return string;
}

getAnnonces("AUDI", "a1", 2000, 2017)
