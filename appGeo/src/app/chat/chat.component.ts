import { Component, OnInit } from '@angular/core';
import { databaseAdd, databaseGet, databaseEventListener } from '../../modules/database'
import { firebase } from "@nativescript/firebase";
import { fromObject } from '@nativescript/core';

const model = {
    msg_to_send : "What Message to Send"
}

const bindingContext = fromObject(model) 

// onLoaded = args => {
//     const page = args.object

//     page.bindingContext = bindingContext
// }

@Component({
  selector: 'Chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  public chats: Array<any>; //change String to any or Message class later
  public msg_sender = "hi"
  constructor() { 
    this.chats = ["testing", "to", "see"];
  }

  ngOnInit(): void {
    this.chats = this.getMsgs();
    databaseEventListener("game/chats", this.updateMsg.bind(this));
    console.log("got to chat");
  }

  getMsgs() {
    let msgs = [];
    databaseGet('game/chats').then(value => {
      //console.log("val: " + value);
      msgs = value;
      //console.log("all msgs: " + msgs);
    });
    return msgs;
  } 

  updateMsg(data: object) {
    //get current chats
    this.chats = [];

    //console.log("data: " + JSON.stringify(data));
    let list = data["value"];
    this.chats = list;
  }

  sendMsg(data){
    //var data = "Testing"
    console.log("Inside the send Message function")
    //this.chats.push(data);
    console.log("What is currently the message to send:", data)
    console.log("What if we use binding context", `${bindingContext.get('msg_to_send')}`)
  }

}

const SUCCESS = 10
const FAILURE = -10
const MAXMESSAGECOUNT = 100
export class Message{
    //timestamp; //Formatting of "mm/dd/yy hh:mm" 
    message_id; //Still to determine if unique to within a Chat or not
    message_content;

    constructor(content){
        //Get the current time right now (in local time) in following format:
        //"MM/DD/YYYY, HH:MM AM/PM"
        // date = Date();
        // this.timestamp = date.toLocaleString('en-US', {
        //                     timeZone: 'CST',
        //                     dateStyle: 'short',
        //                     timeStyle: 'short',
        //                 })
        this.message_id = -1 //Default value for ID, nothing should happen here
        this.message_content = content
    }

    // getTimestamp(){
    //     return this.timestamp;
    // }
    getMessageID(){
        return this.message_id;
    }
    getMessageContent(){
        return this.message_content;
    }
    setMessageID(id_to_set){
        this.message_id = id_to_set;
        return SUCCESS;
    }

    printMessage(){
        //Prints out in following format: "MM/DD/YYYY HH:MM AM/PM <Message content>"
        //let time = this.timestamp;
        let msg = this.message_content;
        //console.log(time.concat(" ", msg));
        console.log(msg)
        return SUCCESS;
    }

}

export class Chat{
    lower_ID; //Lowest ID of a message that should be displayed to a Player
    curr_ID; //Tracks what next message that gets added to this Chat should have
    chat_ID; //ID that marks a unique chat
    hash_ID_to_message;
    player_list; //Tracks all the Player Objects that are in the Chat

    constructor(unique_chat){
        this.lower_ID = 0;
        this.curr_ID = 0;
        this.chat_ID = unique_chat
        this.hash_ID_to_message = new Map();
        this.player_list = new Array();
    }

    getLowerID(){
        return this.lower_ID;
    }
    getCurrID(){
        return this.curr_ID;
    }
    getChatID(){
        return this.chat_ID;
    }
    getHash(){
        return this.hash_ID_to_message;
    }
    getPlayerList(){
        return this.player_list;
    }
    
    // Function that returns Player object that corresponds to the ID given as input
    getPlayer(id_to_find){
        for(var i = 0; i < this.player_list.length; i++){
            var curr_player = this.player_list[i];
            if (curr_player.getUserID() == id_to_find){
                return curr_player;
            }
        }
        //If couldn't find associated userID --->
        return null
    }


    setLowerID(new_lower){
        //Take care of the edge cases, what if pass lower than 0 ID
        if (new_lower <= 0){
            new_lower = 0;
        }

        //Take care of the edge cases, what if pass a HIGHER ID than what is currently being used
        if (new_lower >= this.curr_ID){
            new_lower = this.curr_ID;
        }

        this.lower_ID = new_lower
        return SUCCESS;
    }
    setChatID(new_ID){
        //Could be used in case the Game logic decides that hasn't optimally set ID of chat
        this.chat_ID = new_ID;
        return SUCCESS;
    }

    /* Take in a Player Object and add him to the Chat*/
    insertPlayer(player_to_add){
        // First, add the Player to the Player List within the chat
        this.player_list.push(player_to_add);

        // Then, Player Object gets updated so they know they've been updated with a Chat
        player_to_add.insertChat(this);

        return SUCCESS;
    }

    /* prints out all Player Usernames that are currently in the chat */
    printPlayers(){
        for (var i = 0; i < this.player_list.length; i++){
            var curr_player = this.player_list[i];
            console.log(curr_player.getUsername())
        }

        return SUCCESS;
    }

    history(){
        //Function that returns list of Messages
        //here is when we can use lower_ID and upper_ID so that we don’t overload users
        var message_list = new Array();
        for (let i = this.lower_ID; i <= this.curr_ID; i++){
            var curr_message = this.hash_ID_to_message.get(i)
            message_list.push(curr_message);
        }
        return message_list
    }
    insertMessage(incoming_message){
        //Set the MessageID for the current incoming message
        var bool = incoming_message.setMessageID(this.curr_ID);
        if (bool == FAILURE){
            console.log("error occured during setMessageID() function")
            return FAILURE
        }

        //Want to ensure maximum distance betwen lower ID and curr ID is MAXMESSAGECOUNT
        if (this.curr_ID - this.lower_ID + 1 >= MAXMESSAGECOUNT){
            this.lower_ID++;
        }
        this.curr_ID++;

        //Lastly, update the hash with the appropriate key and message
        this.hash_ID_to_message.set(incoming_message.getMessageID(), incoming_message);
        return SUCCESS;
    }
    voteCommence(){
        //Function that inserts a Message Letting everyone know that voting has started
        var message_content = "---Voting will now commense---"
        var vote_message = new Message(message_content);
        var bool = this.insertMessage(vote_message);
        if (bool == SUCCESS){
            return SUCCESS
        }
        else{
            console.log("error occured during insert Message function");
            return FAILURE
        }
    }

    view(){
        //Will need to be taken care of by the UI
        return SUCCESS
    }
} 