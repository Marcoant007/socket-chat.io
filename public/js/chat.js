const socket = io("http://localhost:3000");

let idChatRoom = "";

function onLoad() {

    const urlParams = new URLSearchParams(window.location.search); //pegar os paramettros da url
    const name = urlParams.get("name");
    const avatar = urlParams.get("avatar");
    const email = urlParams.get("email");

    document.querySelector(".user_logged").innerHTML += `
        <img class="avatar_user_logged" src=${avatar}/>
        <strong id="user_logged">${name}</strong>
    `

    socket.emit("start", {
        name,
        email,
        avatar
    }); // emitir as informações


    //ficar escutando
    socket.on("new_users", user => {
        const existsInDiv = document.getElementById(`user_${user._id}`) // verifica se existe

        if (!existsInDiv) {
            addUser(user); //se não existir cria, pois estava duplicando
        }


    });

    socket.emit("get_users", (users) => {
        

        users.map(user => {
            if (user.email != email) {
                addUser(user)
            }
        })
    })
}

function addUser(user) {
    const usersList = document.getElementById("users_list");
    usersList.innerHTML += `
    <li class="user_name_list" id="user_${user._id}" idUser="${user._id}">
    <img class="nav_avatar" src=${user.avatar}/>
    ${user.name}
    </li> `;
};

socket.on("message", (data)=> {
    console.log("Message:", data);
})



document.getElementById("users_list").addEventListener("click", (event) => {
    if(event.target && event.target.matches("li.user_name_list")) {
        const idUser = event.target.getAttribute("idUser");
        

        socket.emit("start_chat", {idUser}, (data)=> {
            idChatRoom = data.idChatRoom;
        })

    
    }
})

document.getElementById("user_message").addEventListener("keypress", (e)=> {
    if(e.key === "Enter"){
        const message = e.target.value;
        e.target.value = "";


        const data = {
            message,
            idChatRoom
        }

        socket.emit("message", data)
    }
})



onLoad();
