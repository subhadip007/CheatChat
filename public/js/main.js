


const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const botMessages= document.querySelector('.chat-bot-message')
// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const socket = io();
var typing=false;
var timeout=undefined;


// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on('message',(message) => {
  // console.log(message);
  

  if(message.username != username){
  outputMessage(message);
  

;
  
  }else{
    console.log("here")
    outputownMessage(message);
   
  }

 
  socket.on('image',(image)=>{
    //!
    // console.log(image);
    outputImage(image);
    if( document.getElementById('file').value != null)
    document.getElementById('file').value=null;
  })

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});


//Message from bot
socket.on('botmessage',botmessage=>{
     outputbotMessage(botmessage);
})

//! attention

//! ----------------------------------------
// Message submit
chatForm.addEventListener('submit', e => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;
 
  msg = msg.trim();
  
  if (!msg){
    return false;
  }

  // Emit message to server
  socket.emit('chatMessage', msg);
// Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {

         
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  if(message.username != username){
  document.querySelector('.chat-messages').appendChild(div);
  }
}
function outputownMessage(message) {

         
  const div = document.createElement('div');
  div.classList.add('own-message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
  
}

  function outputImage(image){
   const img= document.createElement('img');
   img.classList.add('image1');
   img.src=`data:image/jpg;base64, ${image}`;
   document.querySelector('.chat-messages').appendChild(img); 
}
 function outputOwnImage(image){
   const img= document.createElement('img');
   img.classList.add('own-image');
   img.src=`data:image/jpg;base64, ${image}`;
   document.querySelector('.chat-messages').appendChild(img); 
}

//botmessage
function outputbotMessage(botmessage) {
  const div = document.createElement('div');
  div.classList.add('botmessage');
  const p = document.createElement('p');
  // p.classList.add('meta');
  // div.appendChild(p);  //? not importent currently
  const para = document.createElement('p');
  para.classList.add('bot-text');
  para.innerText = botmessage.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
 userList.innerHTML=`
 ${users.map(user=>`<li>${user.username}</li>`).join('')}`
 }



 //! user is typing still on process
//  $(document).ready(function(){
//   $('#msg').keypress((e)=>{
//     if(e.which!=13){
//       typing=true
//       socket.emit('typing', {user:user, typing:true})
//       clearTimeout(timeout)
//       timeout=setTimeout(typingTimeout, 3000)
//     }else{
//       clearTimeout(timeout)
//       typingTimeout()
//       //sendMessage() function will be called once the user hits enter
//       sendMessage()
//     }
//   })

//   //code explained later
//   socket.on('display', (data)=>{
//     if(data.typing==true)
//       $('.typing').text(`${data.user} is typing...`)
//     else
//       $('.typing').text("")
//   })
// })

//?emitting the photo here
 document.getElementById('file').addEventListener('change', function(e) {
e.preventDefault();
  const reader = new FileReader();
  reader.onload = function() {
    const bytes = new Uint8Array(this.result);
    socket.emit('image', bytes);
  };
  reader.readAsArrayBuffer(this.files[0]);

}, false);


async function play() {
  var audio = new Audio('https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3');
 audio.play();
}