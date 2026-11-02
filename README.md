# Ghostly 👻

Watch Instagram stories without anyone knowing. Read DMs without the "Seen" label. That's the whole extension.

Made by **Gaurab Pantha** for Hack Club, from Nepal 🇳🇵

---

## What it does

Turn **Ghost mode** on and Instagram stops telling people what you're up to:

- 👀 **Story views:** You watch a story, and your name doesn't appear in the viewers list.
- ✅ **"Seen" in DMs:** You read a message, and it doesn't say "Seen".
- 💬 **"Typing…":** You start typing, and nothing shows on the other person's screen.

One big button turns everything on or off. Three small switches let you choose which of these to hide. There's no scanning, no account, and no settings page.

The popup also has a small counter that shows how many things were hidden, so you can see it working.

## How to install (about one minute)

1. Unzip the folder.
2. Open `chrome://extensions` in Chrome.
3. Turn on **Developer mode** (top right).
4. Click **Load unpacked** and choose the folder that contains `manifest.json`.
5. **Reload Instagram** if it was already open. This is important, otherwise it won't work in that tab.
6. Click the ghost icon. Green means you're invisible 😎

## How to use it

- Open the ghost icon. A green button means ON, and a grey button means OFF.
- Watch a story. A small yellow message ("Hid your story view") appears in the corner. That means it's working.
- To be seen again, switch it off.

## Is it safe?

Yes. Ghostly does **not**:

- Ask for your password.
- Send your data anywhere. There is no server.
- Read your messages or collect anything.

It only runs on instagram.com, and it only stops a few specific "I saw this" messages before they leave your browser. Your settings and the counter are saved in your own browser.

## The honest part (please read)

Ghostly isn't perfect:

- **Stories** are the most reliable part.
- **"Seen" and "typing" in DMs** are best effort. Instagram sends some chat activity through a live connection that Ghostly can't safely block, so something may still get through. Test it with a friend before you trust it with a secret 😅
- **Instagram changes things often.** If Instagram renames its internal requests, Ghost mode can stop working until it's updated.
- Ghostly isn't made by or connected to Instagram, and it may go against Instagram's rules. Use it on your own account, at your own risk.
- If you view a story while Ghost mode is off, you will be seen.

## If it's not working

1. Is the big button green?
2. Did you **reload the Instagram tab** after installing? This is the most common problem.
3. Open the popup and check that the counter goes up when you watch a story.
4. Still nothing? Tell me what you did, and I'll fix it.

## What's inside

```
manifest.json   Tells Chrome what the extension is
ghost.js        The Ghost mode itself, runs inside the Instagram page
bridge.js       Passes your switches to ghost.js and shows the small tag and message
popup/          The window with the big button
assets/         Icons
```

## Credits

Built by Gaurab Pantha 💜
Instagram: [@myselfgaurav99](https://instagram.com/myselfgaurav99) · GitHub: [gaurab-pantha](https://github.com/gaurab-pantha)