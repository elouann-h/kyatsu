# Kyatsu

Imagine a world where building Discord bots is as easy as writing a simple script.
This world, we created it.

Kyatsu is a NPM package that permits you to create Discord bots in just few lines. Bye hard coding !

## Installation

To install Kyatsu and use it into your project, you just have to run this command in your terminal:
```bash
npm install kyatsu
```
Kyatsu package uses `discord.js` package and `discord-api-types` to work. All is already included in the package.

## Usage

### 1. Importation and instantiation

---

You need to import Kyatsu into your project. To do that, you can copy the following example.
```js
const kyatsu = require('kyatsu');
```

Then, you need to create a new instance of Kyatsu client. You can do that by using the following code.
```js
const kyatsu = require('kyatsu');

const client = new kyatsu.Client.create("your token goes here");
```
You can also use object destructuring to import the Client class. And then, you can log the client.
```js
const { Client } = require('kyatsu');

const client = new Client.create("your token goes here");

client.login();
```

---

### 2. Passing Discord Client options

---

The Kyatsu client is an extension of the Discord.js client. The main parameter of the constructor could be a `string` or an `object`.
If you pass a string, it will be the token of your bot. If you pass an object, it will be the options of the Discord.js client.
You can find the list of the options [here](https://discord.js.org/#/docs/main/stable/typedef/ClientOptions).
By the way, you can also pass the token as an option, and it will be the same as passing it as a string (but no, don't do it).
Kyatsu client has its own properties that you could pass as options.

| Property        | Type       | Description                        |
|-----------------|------------|------------------------------------|
| `token`         | `string`   | The token of your bot.             |
| `defaultEvents` | `string[]` | The default events the bot handle. |

### 3. Events

---

The actual 0.2.0 version of Kyatsu only handle the `ready` event. But we are working on it to add more events.
Per default, the client can listen to multiple events with default callbacks. These events are:
- `ready` : Emitted when the client becomes ready to start working.

How to add events ? You could pass an array of events to the `defaultEvents` property of the client options.
```js
const kyatsu = require('kyatsu');

const options = {
  token: "your token goes here",
    defaultEvents: ['ready']
};
const client = new Client.create(options);

client.login();
```
You can also add or remove events after the instantiation of the client:
```js
const kyatsu = require('kyatsu');

const options = {
  token: "your token goes here",
  defaultEvents: ['ready']
};
const client = new Client.create(options);

// replace 'eventName' by the name of the event you want to add
// add a new event
client.bindEvent("eventName", (eventParams) => {
  // do something
  return;
});
// remove an event
client.unbindEvent("eventName");

client.login();
```

> ⚠️ **Warning:** Once the client is logged in, you can't add or remove events. You can only add or remove events before the login.

---

###### This project is in beta. Made with love by elouann-h.