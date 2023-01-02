
# Trumion

Trumion is the most customizable discord bot in the world. Use real JavaScript code to customize your bot the most efficient way possible.

- Github repository: https://github.trumion.tech
- Discord server: https://discord.gg/WVQKKwP4FE
- Author Github: https://github.com/du-cassoulet

## Command list

- **/help** Use the help command to get a list of available commands or to get more details on how to use a specific command.

- **/api** To get your API authentication code. (To use in the Authorization header of every requests that you will make to this api.)

- **/build** Use this command to create a public command on the bot and use it, you will need to import a JavaScript file to perform this command.

- **/destroy** Use this command to remove a custom command from this server.

- **/detach** Use this command to remove a custom-command from your server.

- **/edit** Use this command if you want to edit a command that you already made.

- **/get** Use this command if you need information about a specific command. If you are the owner of the command you will be able to see the wole command, if you are not it depends of the privacy settings of the command.

- **/info** Use the command info if you want to get more information of how to use the bot and how to code new commands.

- **/locales** Use this command if you want to import locales variables to every programs that you made. You can also use this command to remove locales. Locales are private variables that can be used in every commands that you own with the identifier 'locales'. Exemple 'locales.API_KEY'

- **/pull** Use this command to add an already created command to your server.

- **/store** This command is in the form of a list of commands. Click on the button associated with one of the commands created by the community to upload it to your server.

## API endpoints

API url: https://api.trumion.tech/

### **GET** /guilds/:guildId

*To get information about a specific guild.*

```js
import axios from "axios";

const GUILD_AUTH = '4fe247fd6ea8562b08149df014386991'

const { data } = axios.get("https://api.trumion.tech/guilds/1014821524240343070", {
    headers: {
        'Authorization': GUILD_AUTH
    }
});

console.log(data); // Guild storage data
```

### **GET** /commands

*To get a command list.*

```js
import axios from "axios";

const GUILD_AUTH = '4fe247fd6ea8562b08149df014386991'

const { data } = axios.get("https://api.trumion.tech/commands?slice=1", {
    headers: {
        'Authorization': GUILD_AUTH
    }
});

console.log(data);
/*
  [
    {
      "cid": "cmd-0x3b8d0860",
      "name": "wasted",
      "description": "You are now wasted :(.",
      "createdAt": 1661967660442,
      "guilds": [
        "973949535359475814",
        "1014537202304303214"
      ],
      "usages": 5,
      "privacy": "use-and-read",
      "author": {
        "id": "532631412717649941",
        "tag": "DU CASSOULET#0666"
      }
    }
  ]
*/
```

### **GET** /commands/:commandId

*To get a command by its ID.*

```js
import axios from "axios";

const GUILD_AUTH = '4fe247fd6ea8562b08149df014386991'

const { data } = axios.get("https://api.trumion.tech/commands/cmd-0x3b8d0860", {
    headers: {
        'Authorization': GUILD_AUTH
    }
});

console.log(data);
/*
  {
    "cid": "cmd-0x3b8d0860",
    "name": "wasted",
    "description": "You are now wasted :(.",
    "code": "const { EmbedBuilder } = module(\"discord.js\");\r\nlet link = `https://some-random-api.ml/canvas/wasted/?avatar=${message.author.displayAvatarURL({ format: \"png\" })}`;\r\n\r\nconst embed = new EmbedBuilder().setTitle(`Wasted`).setImage(link);\r\nmessage.channel.send({ embeds: [embed] });",
    "createdAt": 1661967660442,
    "guilds": [
      "973949535359475814",
      "1014537202304303214"
    ],
    "usages": 5,
    "privacy": "use-and-read",
    "author": {
      "id": "532631412717649941",
      "tag": "DU CASSOULET#0666"
    }
  }
*/
```
