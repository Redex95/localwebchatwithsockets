import WebSocket from "ws";

const server = new WebSocket.Server({port:8080});
const MAX_MESSAGE_SIZE = 1000;


let connections = []

server.on("connection",(socket,req)=>{
  connections.push(socket)
  console.log(req.socket.remoteAddress +" - "+req.socket.remotePort +" - "+ "Client connesso");


  socket.on("message",(message)=>{
    if (JSON.parse(message).message.trim() !== "") {
      if (JSON.parse(message).message.trim().length < MAX_MESSAGE_SIZE) {
        let trim_mess = {...JSON.parse(message),message:JSON.parse(message).message.trim()}

        console.log(trim_mess);
        
        connections.forEach((person,index) => {
          try {
            person.send(JSON.stringify(trim_mess));
          } catch (e) {
            console.log("Errore invio al client, rimuovo", idx);
            connections.splice(index, 1);
          }
        });
      
      }
      
    }
    
    
  });

  socket.on("close",()=>{
    const index = connections.indexOf(socket);
    if (index > -1) {
      connections.splice(index, 1);
    }

    console.log("Client disconnected");

    
  })

  
})

