# JS-Lanyard

Use Lanyard in your Web App. [Phineas](https://github.com/Phineas) - Creator of [Lanyard API](https://github.com/Phineas/lanyard)

# CDN

-   Call to your page (`https://cdn.jsdelivr.net/gh/0x5841524f4e/js-lanyard/lanyard.js`)

# Usage

Using without websocket:

```javascript
 // rest with single user example
lanyard({
    userId: "213325478096797697",
}).then(console.log) // presenceData

// rest with multiple  users example
lanyard({
    userId: ["213325478096797697", "331846231514939392"],
}).then(console.log) // presenceData[]
```

Using with websocket:

```javascript
// websocket with single user example
lanyard({
    userId: "213325478096797697",
    socket: true,
    onPresenceUpdate: console.log // presenceData
}) // returns a websocket

// websocket with multiple users example
lanyard({
    userId: ["213325478096797697", "331846231514939392"],
    socket: true,
    onPresenceUpdate: console.log // presenceData[]
}) // returns a websocket
```

# License

Distributed under the [GPL-3.0](https://www.gnu.org/licenses/gpl-3.0.html) License. See `LICENSE` for more information.
