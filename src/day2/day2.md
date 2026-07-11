# Welcome to Day 2!

> [!IMPORTANT] Important!
> You will each have been given your own API keys. Please do NOT abuse them otherwise they will be disabled - real keys do cost money. Keep max_tokens relatively low too. Thank you <3

# Powering a Real Chat Website with AI — Workshop Activities

Yesterday you built chatbots out of `if`/`elif` statements.

Today you'll take a **real chat website** and put a **real language model** behind it. The
website is already built. Your job is to write the Python backend that sits behind it
and talks to an AI chatbot.

We build it in two stages:

- **Stage 1 (Activities 3–7):** learn how to talk to the AI
- **Stage 2 (Activities 8–13):** drop that code into a server so it powers the actual website.

## Table of Contents

- [Welcome to Day 2!](#welcome-to-day-2)
- [Powering a Real Chat Website with AI — Workshop Activities](#powering-a-real-chat-website-with-ai--workshop-activities)
  - [Table of Contents](#table-of-contents)
  - [1. Recap: Your Fake Chatbot](#1-recap-your-fake-chatbot)
  - [2. Setup](#2-setup)
  - [3. Your First Real AI Reply](#3-your-first-real-ai-reply)
  - [4. Reading the Response](#4-reading-the-response)
  - [5. Make It a Function](#5-make-it-a-function)
  - [6. A Conversation Loop (Goldfish Edition)](#6-a-conversation-loop-goldfish-edition)
  - [7. Give It Memory](#7-give-it-memory)
    - [What's actually happening](#whats-actually-happening)
  - [🚦 **Stage 1 complete.** You can talk to a real AI, and it remembers. Now let's connect it up to our website.](#-stage-1-complete-you-can-talk-to-a-real-ai-and-it-remembers-now-lets-connect-it-up-to-our-website)
  - [8. Meet the Website You're Powering](#8-meet-the-website-youre-powering)
    - [How the website will ask your Python for a reply](#how-the-website-will-ask-your-python-for-a-reply)
  - [9. Meet Your Starter Server](#9-meet-your-starter-server)
  - [10. Fill In the Function](#10-fill-in-the-function)
  - [11. Connect the Function](#11-connect-the-function)
  - [12. Give Your Server Memory](#12-give-your-server-memory)
  - [13. Give Your Bot a Personality](#13-give-your-bot-a-personality)
  - [14. Open ended tasks](#14-open-ended-tasks)

---

## 1. Recap: Your Fake Chatbot

**Goal:** remember what yesterday's "AI" actually was, so you can see what's different today.

Here's a stripped-down version of yesterday's rule based bot.

```python
while True:
    message = input("You: ").lower()
    if "bye" in message:
        print("Bot: Goodbye!")
        break
    elif "hello" in message:
        print("Bot: Hello there!")
    else:
        print("Bot: Tell me more about that.")
```

Ask it something it has no rule for. For example, "whats the capital of Australia".
It falls straight into the `else` section of the code block.

**Think about it:**

- How many `elif` branches would you need to answer _any_ question a person could type? (Trick question it's infinite.)
- That's the way rule based bots work. Today we will work around this by handing the thinking to a real AI model.

---

## 2. Setup

Open VS code and familiarise yourself with the file structure

## 3. Your First Real AI Reply

**Goal:** send one hard-coded question to an AI model and print the answer.

Make a file called `chat.py`.

```python
import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.environ["API_KEY"]

response = requests.post(
    "https://api.anthropic.com/v1/messages",
    headers={
        "content-type": "application/json",
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
    },
    json={
        "model": "claude-haiku-4-5",
        "max_tokens": 1024,
        "messages": [
            {"role": "user", "content": "Explain what an API is, to a 15 year old, in two sentences."}
        ],
    },
)

print(response.json())
```

Run it: `python3 chat.py`

**What each piece means:**

- `requests.post(...)` — send a message to the URL and wait for a reply.
- `headers` — info _about_ the request. Your key goes here, so the server knows it's you.
- `json` — the actual request. `model` picks which AI, `messages` is what you're asking.
- `messages` is a list of questions and responses.

## 4. Reading the Response

**Goal:** pull just the answer out of that response

This chatbots replies come back as nested dictionaries and lists. The text we want is
buried a couple of layers deep:

```python
{'id': 'msg_...', 'content': [{'type': 'text', 'text': 'An API is...'}], ...}
```

To reach the text: go into `content`, grab the first item `[0]`, then its `text`:

```python
data = response.json()
reply = data["content"][0]["text"]
print(reply)
```

---

## 5. Make It a Function

**Goal:** wrap the API call in a reusable function.

Right now our code runs once and stops. Turn the request part into a function
that takes a list of messages and returns the reply text:

```python
import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.environ["API_KEY"]

def get_ai_reply(messages):
    response = requests.post(
        "https://api.anthropic.com/v1/messages",
        headers={
            "content-type": "application/json",
            "x-api-key": API_KEY,
            "anthropic-version": "2023-06-01",
        },
        json={
            "model": "claude-haiku-4-5",
            "max_tokens": 1024,
            "messages": messages,
        },
    )
    return response.json()["content"][0]["text"]


# Test it
answer = get_ai_reply([{"role": "user", "content": "Say hi in one word."}])
print(answer)
```

**Try it yourself:**

- Call `get_ai_reply` twice with two different questions and print both answers.

---

## 6. A Conversation Loop (Goldfish Edition)

**Goal:** let the user chat back and forth and discover a problem.

Wrap your function in a `while` loop, like yesterday's rule based bot:

```python
while True:
    user_input = input("You: ")
    if user_input == "quit":
        break

    reply = get_ai_reply([{"role": "user", "content": user_input}])
    print("ai:", reply)
```

Run it and have a chat. Seems to be working correctly? Now try this exact conversation:

```
You: My name is <insert name>.
AI: Nice to meet you, <insert name>!
You: What's my name?
AI: I don't have any information about your name...
```

**It forgot.** The AI has no way to access previous messages. Every new question is treated
as a seperate request.

---

## 7. Give It Memory

**Goal:** make the bot remember the whole conversation.

Here's the trick: **the API has no memory, so we will resend the entire conversation every
single time.**

We need to create a message history list. Every time the user says something, or the AI replies, we will add it to the list. We then send the _whole list_ on each call:

```python
conversation = []

while True:
    user_input = input("You: ")
    if user_input == "quit":
        break

    # Add the user's turn
    conversation.append({"role": "user", "content": user_input})

    # Send the message history list
    reply = get_ai_reply(conversation)

    # Add AI response
    conversation.append({"role": "assistant", "content": reply})

    print("ai:", reply)
```

Now try the same exercise about remembering a name and see if it works!

### What's actually happening

On the third message, the list you send looks like this:

```python
[
    {"role": "user", "content": "My name is Sam."},
    {"role": "assistant", "content": "Nice to meet you, Sam!"},
    {"role": "user", "content": "What's my name?"},
]
```

The AI reads the whole thing fresh and answers from what it sees. It isn't
_remembering_, instead it reads the message history of the conversation as context.

---

## 🚦 **Stage 1 complete.** You can talk to a real AI, and it remembers. Now let's connect it up to our website.

## 8. Meet the Website You're Powering

**Goal:** understand the website you already have, and how it will talk to your Python.

In the lecture today we went over how our website works. The files should look something like:

```
index.html
style.css
src/script.js
assets/
```

**We will not edit any of these.** They're done. The website already knows how to show
message bubbles, clear the input box, and scroll to the newest message. What it _can't_
currently do is think of a reply.

### How the website will ask your Python for a reply

Open `src/script.js` and find this function near the bottom:

```javascript
const getAiReply = async (message) => {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ message: message }),
  });
  const data = await response.json();
  return data.reply;
};
```

This is the website reaching out to your Python. Read it carefully, because it tells you
exactly what your server has to do:

- It sends a message to the address **`/api/chat`**.
- It sends a little packet of JSON: **`{ "message": "hello" }`**.
- It expects a packet of JSON back with a **`reply`** in it: **`{ "reply": "hi there" }`**.

That's the **contract**. Your Python server must live at `/api/chat`, read the
`message`, and send back a `reply`.

The website never talks to the chatbot directly. It talks to the server, and the server
talks to the chatbot.

---

## 9. Meet Your Starter Server

**Goal:** get the starter server running and check that the website works before adding any AI.

Your have been given you a file called `server.py`.

Three things are already handled:

- Your API key is at the top.
- The `/` route serves the website's home page.
- The `/api/chat` route already reads the `message` and sends back a `reply` (currently not an AI reply)

Run `python3 server.py` and then open `http://localhost:5000` in a browser, type a message, and hit send.

## 10. Fill In the Function

**Goal:** give your server the `get_ai_reply` function from Activity 5.

Find this stub near the top of `server.py`:

```python
def get_ai_reply(messages):
    # TODO get an actual chatbot reply
    pass
```

Replace the body with your function from **Activity 5**

```python
def get_ai_reply(messages):
    response = requests.post(
        "https://api.anthropic.com/v1/messages",
        headers={
            "content-type": "application/json",
            "x-api-key": API_KEY,
            "anthropic-version": "2023-06-01",
        },
        json={
            "model": "claude-haiku-4-5",
            "max_tokens": 1024,
            "messages": messages,
        },
    )
    return response.json()["content"][0]["text"]
```

Save the file.

---

## 11. Connect the Function

**Goal:** make the website give real AI replies.

Find the chat route at the bottom of `server.py`. It currently sets `reply` to the
placeholder:

```python
@app.route("/api/chat", methods=["POST"])
def chat():
    user_message = request.json["message"]

    reply = "PLACEHOLDER — you said: " + user_message

    return jsonify({"reply": reply})
```

Replace the placeholder line so `reply` actually comes from the chatbot. Pass the user's
message to your function, wrapped in the message format the chatbot expects:

```python
@app.route("/api/chat", methods=["POST"])
def chat():
    user_message = request.json["message"]

    reply = get_ai_reply([{"role": "user", "content": user_message}])

    return jsonify({"reply": reply})
```

Save and refresh the website.

Now try the name test again:

```
You: My name is <insert name>.
Bot: Nice to meet you, <insert name>!
You: What's my name?
Bot: I don't know your name...
```

The AI has no memory currently.

---

## 12. Give Your Server Memory

**Goal:** make your website remember the conversation.

Near the top of `server.py` there's already an empty list waiting for you:

```python
conversation = []
```

Use the same logic as we did in Exercise 7.

```python
@app.route("/api/chat", methods=["POST"])
def chat():
    user_message = request.json["message"]

    conversation.append({"role": "user", "content": user_message})

    reply = get_ai_reply(conversation)

    conversation.append({"role": "assistant", "content": reply})

    return jsonify({"reply": reply})
```

Save, refresh, and run the name test one more time.

---

## 13. Give Your Bot a Personality

**Goal:** control how your bot behaves

There's a special field called `system` that shapes every reply. We can change the way our bot behaves by altering this field

Add it to `get_ai_reply` in `server.py`:

```python
        json={
            "model": "claude-haiku-4-5",
            "max_tokens": 1024,
            "system": "You are a pirate. Answer everything in pirate speak, and mention the sea at least once.",
            "messages": messages,
        },
```

Save, refresh, and see how the bot now behaves.
Play around with different personalities you can give the bot.

---

# 14 · Open-Ended Tasks

You've built a working chatbot. Now make it _yours_. None of this actiities are mandatory, but they should provide a solid challenge for those who have managed to get their bot up and working.

> **How to read the difficulty markers**
> 🟢 Easy · 🟡 Medium · Hard
>
> Each task has a **Goal**, some **Hints**, and a **Done when…** line so you know when to stop tinkering and move on.

---

## Task 1 · Explore the API 🟢

**Goal:** Understand what knobs the API gives you, and feel how each one changes our chatbots's replies.

The official reference is your friend here:

- API overview → <https://docs.claude.com/en/api/overview>
- Messages API reference (all request parameters) → linked from the overview

Right now your request only sends `model`, `max_tokens`, `system`, and `messages`. Try adding and adjusting these in the `json={...}` block of `get_ai_reply`:

| Parameter        | What it does                             | Try                                                                    |
| ---------------- | ---------------------------------------- | ---------------------------------------------------------------------- |
| `max_tokens`     | Caps how long the reply can be           | Set it very low (e.g. `30`) and watch replies get cut off mid sentence |
| `temperature`    | Randomness / "creativity", `0.0`–`1.0`   | Ask the same question at `0.0` vs `1.0` a few times and compare        |
| `system`         | Sets the chatbots's role and personality | Rewrite it as a pirate, or even compclub mentor                        |
| `stop_sequences` | Text that makes the chatbot stop early   | Give it `["\n\n"]` and see what happens                                |

**Done when…** you can explain to a mentor in one sentence each, what `temperature`, `max_tokens`, and the `system` parameters do

---

## Task 2 · Add Non-AI Commands 🟡

**Goal:** Let the user type special commands that the server handles _itself_, without calling the chatbot. Start with `/clear` to reset the conversation.

**Hints:**

- Handle this in the backend, inside your `/api/chat` route, **before** you call `get_ai_reply`.
- Check the incoming message: if it starts with `/` (or `./`), treat it as a command instead of a prompt.

```python
if user_message.strip() == "/clear":
    conversation.clear()
    return jsonify({"reply": "🧹 Conversation cleared."})
```

- Once `/clear` works, add more: `/help` (list commands), `/system <text>` (change the system prompt on the fly), `/undo` (remove the last exchange).

**Done when…** typing `/clear` empties the history and the website reflects this functionality

---

## Task 3 · Persistent Memory (Save to a File) 🟡

**Goal:** Right now, restarting the server wipes the bot's memory. Fix that by saving the conversation to a file and loading it back on startup.

**Hints:**

- The `conversation` list is just data you can dump it to JSON.

```python
import json

HISTORY_FILE = "history.json"

def save_history():
    with open(HISTORY_FILE, "w") as f:
        json.dump(conversation, f)

def load_history():
    try:
        with open(HISTORY_FILE) as f:
            return json.load(f)
    except FileNotFoundError:
        return []

conversation = load_history()
```

- Call `save_history()` **after** you append the assistant's reply (and after `/clear`).
- Handle the case when there is no file (first save)

**Done when…** you can tell the bot to remember a specific word (for example pineapple), restart the server, and have the bot remember the word

---

## Task 4 · Trim Conversation Automatically 🔴

**Goal:** Long conversations cost more tokens and eventually overflow the model's context. Set a maximum memory size and trim old messages automatically when you exceed it.

Note: you may want to add in a new "/" command that prints the saved chatlog history for the purposes of debugging this.

**Hints:**

- Decide your limit as a number of _messages_ (each user/assistant turn is one entry), e.g. keep the most recent 20.
- Trim from the **front** (oldest first):

```python
MAX_MESSAGES = 20

def trim_history():
    while len(conversation) > MAX_MESSAGES:
        conversation.pop(0)
```

**Done when…** a very long conversation is automatically trimmed.

---

## Extra Extension Ideas

Note: some of these are fairly difficuly and may require editing our website itself. Please feel free to ask mentors for help with them if you feel stuck or unsure where to start.

- **🟢 Timestamps** on each message bubble in the UI.
- **🟡 Personality switcher** — a dropdown or `/persona` command that swaps between several system prompts.
- **🟡 Export the chat** — a button that downloads the conversation as a `.txt` or `.md` file.
- **🟡 Loading indicator** — show a "chatbot is typing…" bubble while you wait for the reply.
- **🔴 Multiple separate chats** — give each conversation an ID so one user can keep several concurrent conversations

---
