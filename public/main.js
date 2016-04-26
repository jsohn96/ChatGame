$(function() {
  var FADE_TIME = 150; // ms
  var TYPING_TIMER_LENGTH = 400; // ms
  var COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
  ];

  // Initialize variables
  var $squirrel = false;

  var $window = $(window);
  var $usernameInput = $('.usernameInput'); // Input for username
  var $messages = $('.messages'); // Messages area
  var $inputMessage = $('.inputMessage'); // Input message input box
  var $inputGoal = $('.inputGoal'); // Input message input box

  var $loginPage = $('.login.page'); // The login page
  var $chatPage = $('.chat.page'); // The chatroom page

  // Prompt for setting a username
  var username;
  var connected = false;
  var typing = false;
  var lastTypingTime;
  var $currentInput = $usernameInput.focus();

  var socket = io();
//squirrel talk win Check
  var goal = "Who";

  function addParticipantsMessage (data) {
    var message = '';
    if (data.numUsers === 1) {
      message += "there's 1 participant";
    } else {
      message += "there are " + data.numUsers + " participants";
    }
    log(message);
  }

  // Sets the client's username
  function setUsername () {
    username = cleanInput($usernameInput.val().trim());

    // If the username is valid
    if (username) {
      $loginPage.fadeOut();
      $chatPage.show();
      $loginPage.off('click');
      

      ////////
      console.log(username);
      var chatAreaClass = document.getElementsByClassName("chatArea");
      if(username == "squirrel"){
        
        var message = "Goals";
          log(message, {
            prepend: false
          });
          var message = "As a squirrel, you are trying to communicate your desires to the human participant.";
          log(message, {
            prepend: false
          });
          var message = "The game ends once you have communicated your desired sentence.";
          log(message, {
            prepend: false
          });
          var message = "However, you are limited in your linguisitc abilities.";
          log(message, {
            prepend: false
          });
          var message = "Still, it is all good because you are a fast learner.";
          log(message, {
            prepend: false
          });

        var message = "Rules";
          log(message, {
            prepend: false
          });

        var message = "As the SQUIRREL, you can communicate to our human participant by pressing the BUTTONS provided to you.";
          log(message, {
            prepend: false
          });

          var message = "These buttons will correspond to the words the human participant has used.";
          log(message, {
            prepend: false
          });

          var message = "After Constructing the message, you can press ENTER to send the message.";
          log(message, {
            prepend: false
          });

          var message = "Example:";
          log(message, {
            prepend: false
          });
          var message = "I am a hungry squirrel, feed me.";
          log(message, {
            prepend: false
          });

          var message = "or";
          log(message, {
            prepend: false
          });

          var message = "Glory to the squirrels, down with the humans!";
          log(message, {
            prepend: false
          });



        var x = document.getElementById("inputMessage");
        chatAreaClass[0].style.padding = "0px 0px 250px 0px";
        $squirrel = true;
        x.style.display = "none";
        $inputMessage = $('#squirrelMessage');
      } else {
        $inputGoal.hide();
        var message = "Goals";
          log(message, {
            prepend: false
          });
          var message = "As a human participant, you are in a fortunate position where you get to talk to a squirre.";
          log(message, {
            prepend: false
          });
          var message = "You are free to talk to the squirrel in any way you please, as long as it is with respect.";
          log(message, {
            prepend: false
          });
          var message = "It is your goal to understand what the squirrel is trying to communicate.";
          log(message, {
            prepend: false
          });
          

        var message = "The game will end once the squirrels desires have been communicated to you.";
          log(message, {
            prepend: false
          });
          var message = "I hope you have an enjoyable conversation.";
          log(message, {
            prepend: false
          });

        


        var x = document.getElementById("squirrelMessage");
        var y = document.getElementById("squirrelChat");
        chatAreaClass[0].style.padding = "0px 0px 60px 0px";
        x.style.display = "none";
        y.style.display = "none";
        $inputMessage = $('#inputMessage');
        $inputGoal = $('#inputGoal');
        $currentInput = $inputMessage.focus();
        $currentInput = $inputGoal.focus();
        $squirrel = false;

      }
      ////////

      // Tell the server your username
      socket.emit('add user', username);
    }
  }

  // Sends a chat message
  function sendMessage () {
    goal = $inputGoal.val();
    var message = $inputMessage.val();
    // Prevent markup from being injected into the message
    message = cleanInput(message);
    // if there is a non-empty message and a socket connection
    if (message && connected) {
      $inputMessage.val('');
      addChatMessage({
        username: username,
        message: message
      });
      // tell server to execute 'new message' and send along one parameter
      socket.emit('new message', message);
    }
  }

  // Log a message
  function log (message, options) {
    var $el = $('<li>').addClass('log').text(message);
    addMessageElement($el, options);
  }

  // Adds the visual chat message to the message list
  function addChatMessage (data, options) {
    // Don't fade the message in if there is an 'X was typing'
    var $typingMessages = getTypingMessages(data);
    options = options || {};
    if ($typingMessages.length !== 0) {
      options.fade = false;
      $typingMessages.remove();
    }

    var $usernameDiv = $('<span class="username"/>')
      .text(data.username)
      .css('color', getUsernameColor(data.username));
    var $messageBodyDiv = $('<span class="messageBody">')
      .text(data.message);

    var typingClass = data.typing ? 'typing' : '';
    var $messageDiv = $('<li class="message"/>')
      .data('username', data.username)
      .addClass(typingClass)
      .append($usernameDiv, $messageBodyDiv);

///////
    if(data.message != 'is typing'){
      var $thisUserName = data.username;
      var $thisMessageBody = data.message;
      if($thisUserName != "squirrel"){
        var $words = $thisMessageBody.split(/\s+/);
        var $arrayLength = $words.length;

        var sentenceDivideDiv = document.createElement("div");
        sentenceDivideDiv.className = "lineSeparate";
     
        for (var i = 0; i < $arrayLength; i++) {
          // console.log($words[i]);
          var buttonMash = document.createElement("BUTTON");
          buttonMash.setAttribute("id", $words[i]);
          
          var node = document.createTextNode($words[i]);
          buttonMash.addEventListener("click", function() {buttonClicked(this.id)});
          buttonMash.appendChild(node);

          sentenceDivideDiv.className = "lineSeparate";
          sentenceDivideDiv.appendChild(buttonMash);
        }
        var element = document.getElementById("squirrelChat");
        element.appendChild(sentenceDivideDiv);
      } else {
        if(CheckForWin($thisMessageBody)) {
          $winMessageName = $('<span class="username"/>').text("WIN");
          $winMessageDiv = $('<span class="messageBody">').text("COMMUNICATION WITH THE SQUIRREL SUCCESSFUL!");
          $messageDiv.append($winMessageName, $winMessageDiv);
        }

      }
    }
/////// 

    addMessageElement($messageDiv, options);
  }


  

  // Adds the visual chat typing message
  function addChatTyping (data) {
    data.typing = true;
    data.message = 'is typing';
    addChatMessage(data);
  }

  // Removes the visual chat typing message
  function removeChatTyping (data) {
    getTypingMessages(data).fadeOut(function () {
      $(this).remove();
    });
  }

  // Adds a message element to the messages and scrolls to the bottom
  // el - The element to add as a message
  // options.fade - If the element should fade-in (default = true)
  // options.prepend - If the element should prepend
  //   all other messages (default = false)
  function addMessageElement (el, options) {
    var $el = $(el);

    // Setup default options
    if (!options) {
      options = {};
    }
    if (typeof options.fade === 'undefined') {
      options.fade = true;
    }
    if (typeof options.prepend === 'undefined') {
      options.prepend = false;
    }

    // Apply options
    if (options.fade) {
      $el.hide().fadeIn(FADE_TIME);
    }

    

    if (options.prepend) {
      $messages.prepend($el);
    } else {
      $messages.append($el);
    }
    $messages[0].scrollTop = $messages[0].scrollHeight;
  }

  // Prevents input from having injected markup
  function cleanInput (input) {
    return $('<div/>').text(input).text();
  }

  // Updates the typing event
  function updateTyping () {
    if (connected) {
      if (!typing) {
        typing = true;
        socket.emit('typing');
      }
      lastTypingTime = (new Date()).getTime();

      setTimeout(function () {
        var typingTimer = (new Date()).getTime();
        var timeDiff = typingTimer - lastTypingTime;
        if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
          socket.emit('stop typing');
          typing = false;
        }
      }, TYPING_TIMER_LENGTH);
    }
  }

  // Gets the 'X is typing' messages of a user
  function getTypingMessages (data) {
    return $('.typing.message').filter(function (i) {
      return $(this).data('username') === data.username;
    });
  }

  // Gets the color of a username through our hash function
  function getUsernameColor (username) {
    // Compute hash code
    var hash = 7;
    for (var i = 0; i < username.length; i++) {
       hash = username.charCodeAt(i) + (hash << 5) - hash;
    }
    // Calculate color
    var index = Math.abs(hash % COLORS.length);
    return COLORS[index];
  }

  function CheckForWin (squirrelTalk) {
    //
    squirrelTalk = squirrelTalk.replace(/ /g,'');
    if(goal == squirrelTalk){
      return true;
    }
    return false;

    // str.toLowerCase();

  }

  // Keyboard events

  $window.keydown(function (event) {
    // Auto-focus the current input when a key is typed
    if (!(event.ctrlKey || event.metaKey || event.altKey)) {
      $currentInput.focus();
    }

    // When the client hits ENTER on their keyboard
    if (event.which === 13) {
      if (username) {
        sendMessage();
        socket.emit('stop typing');
        typing = false;
      } else {
        setUsername();
      }
    }
  });

  $inputMessage.on('input', function() {
    updateTyping();
  });

  // Click events

  // Focus input when clicking anywhere on login page
  $loginPage.click(function () {
    $currentInput.focus();
  });

  // Focus input when clicking on the message input's border
  $inputMessage.click(function () {
    if($squirrel == false){
      $inputMessage.focus();
    }
  });

  $inputGoal.click(function () {
    if($squirrel == false){
      $inputGoal.focus();
    }
  });

  // Socket events

  // Whenever the server emits 'login', log the login message
  socket.on('login', function (data) {
    connected = true;
    // Display the welcome message
    var message = "Welcome to our investigation conducted by the department of Squirrel Relations";
    log(message, {
      prepend: true
    });
    addParticipantsMessage(data);
  });

  // Whenver the server emits 'new message', update the chat body
  socket.on('new message', function (data) {
    addChatMessage(data);
  });

  // Whenever the server emits 'user joined', log it in the chat body
  socket.on('user joined', function (data) {
    log(data.username + ' joined');
    addParticipantsMessage(data);
  });

  // Whenever the server emits 'user left', log it in the chat body
  socket.on('user left', function (data) {
    log(data.username + ' left');
    addParticipantsMessage(data);
    removeChatTyping(data);
  });

  // Whenever the server emits 'typing', show the typing message
  socket.on('typing', function (data) {
    addChatTyping(data);
  });

  // Whenever the server emits 'stop typing', kill the typing message
  socket.on('stop typing', function (data) {
    removeChatTyping(data);
  });
});
