# JS-Lanyard

Use Lanyard in your Web App. [Phineas](https://github.com/Phineas) - Creator of [Lanyard API](https://github.com/Phineas/lanyard)

# CDN

-   Call to your page (`https://cdn.jsdelivr.net/gh/xaronnn/js-lanyard/lanyard.min.js`)

# Usage

Using without websocket:

```javascript
const lanyard = new Lanyard("213325478096797697");

(async () => {
    const data = await lanyard.fetch();
    console.log(data);
})();
```

Using with websocket:

```javascript
const lanyard = new Lanyard("213325478096797697");

//SOCKET CONNECTION [INIT_STATE, PRESENCE_UPDATE, ALL]
lanyard.on("INIT_STATE", (data) => {
    console.log(data);
})
```

# License

Distributed under the [GPL-3.0](https://www.gnu.org/licenses/gpl-3.0.html) License. See `LICENSE` for more information.
