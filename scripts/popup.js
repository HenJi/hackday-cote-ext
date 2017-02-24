var message;
var content;

chrome.runtime.onMessage.addListener(function(request, sender) {
  console.log("Message reçu popup")
  console.dir(request)
  if (request.action == "infos") {
    const { marque, modele, version } = request.data.voiture;
    message.innerText = `Marque : ${marque}\nModèle : ${modele}\nVersion : ${version}`;
  }
});

function onWindowLoad() {

  message = document.querySelector('#message');
/*
  chrome.tabs.executeScript(null, {
    file: "scripts/getPageSource.js"
  }, function() {
    // If you try and inject into an extensions page or the webstore/NTP you'll get an error
    if (chrome.runtime.lastError) {
      message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
    }
  });
*/
}

window.onload = onWindowLoad;
