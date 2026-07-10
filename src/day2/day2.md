# Welcome to Day 2!

# Powering a Real Chat Website with AI — Workshop Activities

Yesterday you built chatbots out of `if`/`elif` statements.

Today you'll take a **real chat website** and put a **real language model** behind it. The
website is already built. Your job is to write the Python backend that sits behind it
and talks to an AI chatbot.

We build it in two stages:

- **Stage 1 (Activities 3–7):** learn how to talk to the AI
- **Stage 2 (Activities 8–13):** drop that code into a server so it powers the actual website.

## Table of Contents

1. [Recap: Your Fake Chatbot](#1-recap-your-fake-chatbot)
2. [Setup: Get the Tools](#2-setup-get-the-tools)
3. [Your First Real AI Reply](#3-your-first-real-ai-reply)
4. [Reading the Response](#4-reading-the-response)
5. [Make It a Function](#5-make-it-a-function)
6. [A Conversation Loop (Goldfish Edition)](#6-a-conversation-loop-goldfish-edition)
7. [Give It Memory](#7-give-it-memory)
8. [Meet the Website You're Powering](#8-meet-the-website-youre-powering)
9. [Build the Server](#9-build-the-server)
10. [Run It — Chat on Your Website](#10-run-it--chat-on-your-website)
11. [Give Your Bot a Personality](#11-give-your-bot-a-personality)

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

## 2. Setup: Get the Tools

A **language model** such as chatgpt or claude is far too big to run locally on a personal laptop or computer.
To use it, your program sends a message over the internet and
waits for a reply. The tool for sending that message is a Python library called
`requests`.

### Install it

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install requests flask
```

On Windows, the middle line is `.venv\Scripts\activate` instead.

Your terminal prompt should now start with `(.venv)`. That means it worked. (We're
installing `flask` now too, as we will need it in Stage 2.)

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
