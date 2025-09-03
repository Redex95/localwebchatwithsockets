const socket = new WebSocket("ws://127.0.0.1:8080 ")

const textArea = document.getElementById("text");
const chatArea = document.getElementById("chat")
const getToBottom = document.getElementById("getToBottom")


let messaggi = []
if (localStorage.getItem("messaggi")) {
  messaggi = JSON.parse(localStorage.getItem("messaggi"))
  messaggi.forEach(mess => {
    displayMess(mess)
  });
}
else{
  localStorage.setItem("messaggi", JSON.stringify([]))
}


if (!localStorage.getItem("chatId")) {
  localStorage.setItem("chatId", randomId());
}

textArea.onkeydown = (e)=>{
  if (e.key === "Enter") {
    sendMess();
  }
}

getToBottom.addEventListener("click",(e)=>{
  chatArea.scrollTop = chatArea.scrollHeight;
})


chatArea.onscroll = ()=>{
  if (chatArea.scrollTop + chatArea.clientHeight >= chatArea.scrollHeight) {
    getToBottom.classList.add("hidden")
  }
  else{
    getToBottom.classList.remove("hidden")

  }
  
}

socket.onopen = (e)=>{
  console.log("Connession Established");
}

socket.onmessage = (e)=>{
  mess = JSON.parse(e.data)
  console.log(mess);
  
  const isNearBottom = chatArea.scrollHeight - (chatArea.scrollTop + chatArea.clientHeight);

  displayMess(mess);
  saveMess(mess)
  
  if (isNearBottom <= 50) {
    chatArea.scrollTop = chatArea.scrollHeight;
  }

  
}

socket.onclose = function (event) {
  console.log("Connection Closed");
};

socket.onerror = function (error) {
  console.error("Error", error);
};


function sendMess() {
  const now = new Date();
  const formatted = now.toLocaleString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
  socket.send(JSON.stringify({id:localStorage.getItem("chatId"),message:textArea.value,dateSent: formatted}))
  textArea.value = ""
}

function displayMess(mess) {
  const messBox = document.createElement("div")
  const pText = document.createElement("p")
  const pDate = document.createElement("p")
  pDate.classList.add("dataInvio")

  messBox.classList.add("messBox")

  if (localStorage.getItem("chatId")==mess.id) {
    messBox.classList.add("mineMess")
  }

  messBox.appendChild(pText)
  messBox.appendChild(pDate)
  pText.textContent = `${mess.message} - ${mess.id}`
  pDate.textContent = mess.dateSent
  
  chatArea.appendChild(messBox)


}

function randomId(length = 6) {
  return Math.random().toString(36).substring(2, length+2);
}

function saveMess(mess){
  var storedmess = JSON.parse(localStorage.getItem("messaggi"));

  if (storedmess.length > 100) {
    storedmess.shift()
  }

  storedmess.push(mess)
  localStorage.setItem("messaggi", JSON.stringify(storedmess))

}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(reg => {
      console.log('Service Worker registrato', reg);
    }).catch(err => {
      console.error('Errore registrazione SW', err);
    });
  });
}