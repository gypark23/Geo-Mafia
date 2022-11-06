const SUCCESS = 10
const FAILURE = -10

export class Message{
    timestamp; //Formatting of "mm/dd/yy hh:mm" 
    message_id; //Still to determine if unique to within a Chat or not
    message_content;

    constructor(content){
        //Get the current time right now (in local time) in following format:
        //"MM/DD/YYYY, HH:MM AM/PM"
        date = Date();
        this.timestamp = date.toLocaleString('en-US', {
                            timeZone: 'CST',
                            dateStyle: 'short',
                            timeStyle: 'short',
                        })
        this.message_id = -1 //Default value for ID, nothing should happen here
        this.message_content = content
    }

    getTimestamp(){
        return this.timestamp;
    }
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
        let time = this.timestamp;
        let msg = this.message_content;
        console.log(time.concat(" ", msg));
    }

}

export class Chat{
    lower_ID; //Lowest ID of a message that should be displayed to a Player
    curr_ID; //Tracks what next message that gets added to this Chat should have
    chat_ID; //ID that marks a unique chat
    hash_ID_to_message;

    constructor(unique_chat){
        this.lower_ID = 0;
        this.curr_ID = 0;
        this.chat_ID = unique_chat
        this.hash_ID_to_message = new Map();
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

    history(){
        //Function that returns list of Messages
        //here is when we can use lower_ID and upper_ID so that we don’t overload users
        message_list = [];
        for (let i = this.lower_ID; i <= this.curr_ID; i++){
            curr_message = hash_ID_to_message.get(i)
            message_list.push(curr_message);
        }
        return message_list
    }
    insertMessage(incoming_message){
        //Set the MessageID for the current incoming message
        bool = incoming_message.setMessageID(this.curr_ID);
        if (bool == FAILURE){
            console.log("error occured during setMessageID() function")
            return FAILURE
        }
        //Raise the lower ID since there is a new message that arrived, and set curr_ID accordingly
        this.lower_ID++;
        this.curr_ID++;

        //Lastly, update the hash with the appropriate key and message
        hash_ID_to_message.set(incoming_message.getMessageID(), incoming_message);
        return SUCCESS;
    }
    voteCommence(){
        //Function that inserts a Message Letting everyone know that voting has started
        vote_message = Message("---Voting will now commense---");
        bool = this.insertMessage(vote_message);
        if (bool == SUCCESS){
            return SUCCESS
        }
        else{
            console.log("error occured during insert Message function");
            return FAILURE
        }
    }
} 