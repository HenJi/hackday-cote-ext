function computeAverage(lst) {
  return Math.round(lst.reduce((a,b) => a+b, 0) / lst.length);
}

function parseHtml(data) { return $(data.replace(/<img[^>]*>/g,"")); }

function upperCaseFirst(string) {
  if (string) {
    const head = string.substring(0, 1).toUpperCase();
    const tail = string.substring(1).toLowerCase();
    return head + tail;
  } else return string;
}
