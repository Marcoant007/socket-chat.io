const socket = io("http://localhost:3000");

socket.on("O evento sapeca", data=> {
    console.log(data);
})
