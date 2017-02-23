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

}

window.onload = onWindowLoad;
