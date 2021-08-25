import IOEVENTS from '../../io-events.js';

const socket = io();

const users = [];

$(document).ready(() => {

    $("#btnSend").click(() => {
        const message = {
           text: $("#txtMessage").val()
        }
        socket.emit(IOEVENTS.SEND, message);
        $("#txtMessage").val("");
    });

    $("#txtMessage").keypress(e => {
        if(e.keyCode === 13) {
            const message = {
                text: $("#txtMessage").val()
             }
             socket.emit(IOEVENTS.SEND, message);
             $("#txtMessage").val("");
        }
    });

    $("#btnUpdateUsername").click(() => {
        const identity = {
            name: $("#txtUsername").val()
        };
        socket.emit(IOEVENTS.CHANGE_USERNAME, identity);

    })

});

//TODO: Réceptions des évenement
socket.on(IOEVENTS.USER_ONLINE, users => {
    $(".users").empty();
    users.forEach(u => {
        const userLi = createUserUI(u);
        $(".users").append(userLi);
    });
});

socket.on(IOEVENTS.RECEIVED, message => {
    const isFromMe = socket.id === message.sender.id;
    const messageLi = createMessageUI(message, isFromMe);
    $("#chat-messages").append(messageLi);
   
});


function createMessageUI(message, isFromMe) {
    let messageLi = "";

    if(!isFromMe) {
        messageLi = 
            `<li class="chat-left">
                <div class="chat-avatar">
                <img src="${message.sender.avatar}" alt="${message.sender.name}">
                <div class="chat-name">${message.sender.name}</div>
                </div>  
                <div class="chat-text">${message.text}</div>
                <div class="chat-hour">${dayjs(message.timestamp).format('HH:mm')} <span class="fa fa-check-circle"></span></div>
            </li>`;
    } else {
        messageLi = 
            `<li class="chat-right">
                <div class="chat-hour">${dayjs(message.timestamp).format('HH:mm')} <span class="fa fa-check-circle"></span></div>
                <div class="chat-text">${message.text}</div>
                <div class="chat-avatar">
                    <img src="${message.sender.avatar}" alt="${message.sender.name}">
                    <div class="chat-name">${message.sender.name}</div>
                </div>
            </li>`
    }
   
    return messageLi;
}

function createUserUI(user){

    const userLi = 
        `<li class="person" data-chat="${user.id}">
            <div class="user">
                <img src="${user.avatar}" alt="${user.name}">
            </div>
            <p class="name-time">
                <span class="name">${user.name}</span>
            </p>
        </li>`;

    
    return userLi;

}


