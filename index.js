const Discord = require('discord.js')
const client = new Discord.Client()
const config = require('./config.json');

client.on('message', (receivedMessage) => {
    if (receivedMessage.author == client.user) { // Prevent bot from responding to its own messages
        return
    } else if (receivedMessage.content.startsWith("/")) {
        processCommand(receivedMessage)
    } else {
        receivedMessage.channel.send("I don't understand the command. Try /r 3b 5r 3d to roll");
    }
})

function processCommand(receivedMessage) {
    let fullCommand = receivedMessage.content.substr(1); // Remove the leading forward slash  
    let splitCommand = fullCommand.split(" "); // Split the message up in to pieces for each space
    let primaryCommand = splitCommand[0]; // The first word directly after the exclamation is the command

    let blackDice = splitCommand[1];
    let extractBlackDice = blackDice.replace('b', ' '); //Remove 'b' at the end to isolate check dice 

    let redDice = splitCommand[2];
    let extractRedDice = redDice.replace('r', ' '); //Remove 'r' at the end to isolate hunger dice 
    
    let diffcuitly = splitCommand[3];
    let extractreDiffcuitly = diffcuitly.replace('d', ' '); //Remove 'd' at the end to isolate diffcuitly dice 

    if (primaryCommand == "r") {
        generateRoll(extractBlackDice, extractRedDice, receivedMessage, extractreDiffcuitly);
    } else {
        receivedMessage.channel.send("I don't understand the command. Try /r 3b 5r 3d to roll");
    }
}

function generateRoll(blackDice, getHungryDice, receivedMessage, extractDiffcuitly) {
    let i;
    const success = 1;
    let blackCritSuccessCount = 0;
    let redCritSuccessCount = 0;
    let blackSuccess = 0;
    let redSuccess = 0;
    let blackDiceArray = []
    let redDiceArray = []
    let checkResultsArray = [];
    let hungerResultsArray = [];
    let messyCrit = false;

    for (i = 0; i < blackDice; i++) {
        let calcBlack = Math.floor(Math.random() * 10) + 1;
        blackDiceArray.push(calcBlack);

        if (calcBlack >= 6 && calcBlack <= 9) {
            blackSuccess = blackSuccess + success;
        } else if (calcBlack === 10) {
            blackCritSuccessCount = blackCritSuccessCount + success;
        }
    }

    for (i = 0; i < getHungryDice; i++) {
        let calcRed = Math.floor(Math.random() * 10) + 1;
        redDiceArray.push(calcRed);

        if (calcRed >= 6 && calcRed <= 9) {
            redSuccess = redSuccess + success;
        } else if (calcRed === 10) {
            redCritSuccessCount = redCritSuccessCount + success;
            messyCrit = true;
        }
    }

    switch (blackCritSuccessCount) {
        case 1:
            blackSuccess = blackSuccess + 1;
            break;
        case 2:
            blackSuccess = blackSuccess + 4;
            break;
        case 3:
            blackSuccess = blackSuccess + 5;
            break;
        case 4:
            blackSuccess = blackSuccess + 8;
            break;
        case 5:
            blackSuccess = blackSuccess + 9;
            break;
        case 6:
            blackSuccess = blackSuccess + 12;
            break;
        case 7:
            blackSuccess = blackSuccess + 13;
            break;
        case 8:
            blackSuccess = blackSuccess + 16;
            break;
        case 9:
            blackSuccess = blackSuccess + 17;
            break;
        case 10:
            blackSuccess = blackSuccess + 20;
            break;
    }

    switch (redCritSuccessCount) {
        case 1:
            redSuccess = redSuccess + 1;
            break;
        case 2:
            redSuccess = redSuccess + 4;
            break;
        case 3:
            redSuccess = redSuccess + 5;
            break;
        case 4:
            redSuccess = redSuccess + 8;
            break;
        case 5:
            redSuccess = redSuccess + 9;
            break;
        case 6:
            redSuccess = redSuccess + 12;
            break;
        case 7:
            redSuccess = redSuccess + 13;
            break;
        case 8:
            redSuccess = redSuccess + 16;
            break;
        case 9:
            redSuccess = redSuccess + 17;
            break;
        case 10:
            redSuccess = redSuccess + 20;
            break;
    }

    let totalSuccess = blackSuccess + redSuccess;

    for (i = 0; i < blackDice; i++) {
        if (blackDiceArray[i] >= 6 && blackDiceArray[i] <= 10) {
           checkResultsArray.push(" " +blackDiceArray[i]+ " ");
        } else {
            checkResultsArray.push(" ~~"+blackDiceArray[i]+"~~ ");
        }
    }

    for (i = 0; i < getHungryDice; i++) {
        if (redDiceArray[i] >= 6 && redDiceArray[i] <= 10) {
            hungerResultsArray.push(" " +redDiceArray[i]+ " ");
        } else {
            hungerResultsArray.push(" ~~"+redDiceArray[i]+"~~");
        }
    }

    if (totalSuccess >= extractDiffcuitly && messyCrit == false) {
       receivedMessage.channel.send("Black Dice: " + checkResultsArray.toString());
       receivedMessage.channel.send("Red Dice: " + hungerResultsArray.toString());
        receivedMessage.channel.send("Total Successes: " + totalSuccess);
        receivedMessage.channel.send("```diff\n+Pass\n```");
    } else if (totalSuccess >= extractDiffcuitly && messyCrit == true) {
        receivedMessage.channel.send("Black Dice: " + checkResultsArray.toString());
        receivedMessage.channel.send("Red Dice: " + hungerResultsArray.toString());
        receivedMessage.channel.send("Total Successes: " + totalSuccess);
        receivedMessage.channel.send("```fix\nPass but its a messy crit\n```");
    } else if (totalSuccess < extractDiffcuitly && messyCrit == false) {
        receivedMessage.channel.send("Black Dice: " + checkResultsArray.toString());
        receivedMessage.channel.send("Red Dice: " + hungerResultsArray.toString());
        receivedMessage.channel.send("Total Successes: " + totalSuccess);
        receivedMessage.channel.send("```diff\n-Fail\n```");
    } else {
        receivedMessage.channel.send("Black Dice: " + checkResultsArray.toString());
        receivedMessage.channel.send("Red Dice: " + hungerResultsArray.toString());
        receivedMessage.channel.send("Total Successes: " + totalSuccess);
        receivedMessage.channel.send("```diff\n-Critical Fail\n```");
    }
}

client.login(config.token) // Bot token