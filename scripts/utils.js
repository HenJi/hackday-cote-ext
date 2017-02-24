function computeAverage(lst) {
  return Math.round(lst.reduce((a,b) => a+b, 0) / lst.length);
}

function parseHtml(data) { return $(data.replace(/<img[^>]*>/g,"")); }
