//require('dotenv').config();
const Discord = require('discord.js')
const client = new Discord.Client()

//const config = require('./config.json');

client.on('message', (receivedMessage) => {
    if (receivedMessage.author == client.user) { // Prevent bot from responding to its own messages
        return
    } else if (receivedMessage.content.startsWith("/r")) {
        processCommand(receivedMessage);
    }
})

function processCommand(receivedMessage) {
    let whoRolled = receivedMessage.author.username;
    let fullCommand = receivedMessage.content.substr(1); // Remove the leading forward slash  
    let splitCommand = fullCommand.split(" "); // Split the message up in to pieces for each space
    let primaryCommand = splitCommand[0]; // The first word directly after the exclamation is the command

    let blackDice = splitCommand[1];
    let redDice = splitCommand[2];
    let diffcuitly = splitCommand[3];

    if (primaryCommand == "r") {
        generateRoll(blackDice, redDice, receivedMessage, diffcuitly, whoRolled);
    } else {
        receivedMessage.channel.send("I don't understand the command. Try /r 3 5 3 to roll");
    }
}

function generateRoll(blackDice, redDice, receivedMessage, extractDiffcuitly, whoRolled) {
    const success = 1;
    let i;
    let blackSuccess = 0;
    let redSuccess = 0;
    let critSuccessCount = 0;
    let critSuccess = 0;
    let minusHungerDice = 0;
    let blackDiceArray = []
    let redDiceArray = []
    let checkResultsArray = [];
    let hungerResultsArray = [];
    let redDiceCrit = false;
    let totalSuccess;

    if (+redDice > +blackDice) {
        redDice = blackDice;
        minusHungerDice = 0;
    } else {
        minusHungerDice = blackDice - redDice;
    }

    for (i = 0; i < minusHungerDice; i++) {
        let calcBlack = Math.floor(Math.random() * 10) + 1;
        blackDiceArray.push(calcBlack);

        if (calcBlack >= 6 && calcBlack <= 9) {
            blackSuccess = blackSuccess + success;
        } else if (calcBlack === 10) {
            critSuccessCount = critSuccessCount + success;
        }
    }

    for (i = 0; i < redDice; i++) {
        let calcRed = Math.floor(Math.random() * 10) + 1;
        redDiceArray.push(calcRed);

        if (calcRed >= 6 && calcRed <= 9) {
            redSuccess = redSuccess + success;
        } else if (calcRed === 10) {
            redDiceCrit = true;
            critSuccessCount = critSuccessCount + success;
        }
    }

    switch (critSuccessCount) {
        case 1:
            critSuccess = 1;
            break;
        case 2:
            critSuccess = 4;
            break;
        case 3:
            critSuccess = 5;
            break;
        case 4:
            critSuccess = 8;
            break;
        case 5:
            critSuccess = 9;
            break;
        case 6:
            critSuccess = 12;
            break;
        case 7:
            critSuccess = 13;
            break;
    }

    if (critSuccessCount > 0) {
        totalSuccess = blackSuccess + redSuccess + critSuccess;
    } else {
        totalSuccess = blackSuccess + redSuccess;
    }

    for (i = 0; i < minusHungerDice; i++) {
        if (blackDiceArray[i] >= 6 && blackDiceArray[i] <= 10) {
            checkResultsArray.push(" " + blackDiceArray[i] + " ");
        } else {
            checkResultsArray.push(" ~~" + blackDiceArray[i] + "~~ ");
        }
    }

    for (i = 0; i < redDice; i++) {
        if (redDiceArray[i] >= 6 && redDiceArray[i] <= 10) {
            hungerResultsArray.push(" " + redDiceArray[i] + " ");
        } else {
            hungerResultsArray.push(" ~~" + redDiceArray[i] + "~~ ");
        }
    }

    if (totalSuccess >= extractDiffcuitly && redDiceCrit == true && critSuccessCount >= 2) {
        receivedMessage.channel.send("Vampire: " + whoRolled + "\nBlack Dice: " +
            checkResultsArray.toString() + "\nRed Dice: " +
            hungerResultsArray.toString() + "\nTotal Successes: " +
            totalSuccess + "\n```fix\nPass but its a messy crit\n```");
    } else if (totalSuccess >= extractDiffcuitly) {
        receivedMessage.channel.send("Vampire: " + whoRolled + "\nBlack Dice: " +
            checkResultsArray.toString() + "\nRed Dice: " +
            hungerResultsArray.toString() + "\nTotal Successes: " +
            totalSuccess + "\n```diff\n+Pass\n```");
    } else if (totalSuccess < extractDiffcuitly && redDiceCrit == false) {
        receivedMessage.channel.send("Vampire: " + whoRolled + "\nBlack Dice: " +
            checkResultsArray.toString() + "\nRed Dice: " +
            hungerResultsArray.toString() + "\nTotal Successes: " +
            totalSuccess + "\n```diff\n-Fail\n```");
    } else {
        receivedMessage.channel.send("Vampire: " + whoRolled + "\nBlack Dice: " +
            checkResultsArray.toString() + "\nRed Dice: " +
            hungerResultsArray.toString() + "\nTotal Successes: " +
            totalSuccess + "\n```diff\n-Critical Fail\n```");
    }
}

client.login(process.env.token) // Bot token
//client.login(config.token) // Bot token
