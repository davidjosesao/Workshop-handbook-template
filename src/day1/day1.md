# Welcome to Day 1!

# Intro to Python Workshop — Activities

## Table of Contents

1. [Warm-Up: Mad Libs](#1-warm-up-mad-libs)
2. [Temperature Converter](#2-temperature-converter)
3. [Number Guessing Game](#3-number-guessing-game)
4. [List Wrangling](#4-list-wrangling)
5. [Word Counter](#5-word-counter)
6. [Simple Functions Practice](#6-simple-functions-practice)
7. [Rock, Paper, Scissors](#7-rock-paper-scissors)
8. [Open-Ended: Build a Text Adventure](#8-open-ended-build-a-text-adventure)
9. [Open-Ended: Data Snooping](#9-open-ended-data-snooping)
10. [Open-Ended: Pick Your Own Mini-Project](#10-open-ended-pick-your-own-mini-project)
11. [Advanced: Build an Akinator](#11-advanced-build-an-akinator)
12. [Advanced: Rule-Based Chatbot](#12-advanced-rule-based-chatbot)
13. [Advanced: A "Learning" Guessing Game](#13-advanced-a-learning-guessing-game)

---

## 1. Warm-Up: Mad Libs

**Goal:** practice `input()`, `print()`, and string formatting.

Ask the user for a few words, then plug them into a silly story.

```python
name = input("Enter a name: ")
animal = input("Enter an animal: ")
place = input("Enter a place: ")

print(f"Once upon a time, {name} went to {place} and became best friends with a {animal}.")
```

**Try it yourself:**
- Add at least 2 more blanks (an adjective, a number, a food, etc.)
- Make the story at least 3 sentences long

---

## 2. Temperature Converter

**Goal:** practice variables, math operators, and `if`/`else`.

Write a program that asks the user for a temperature and a unit (`C` or `F`), then converts it to the other unit.

```python
temp = float(input("Enter the temperature: "))
unit = input("Is this in C or F? ").upper()

if unit == "C":
    converted = temp * 9 / 5 + 32
    print(f"{temp}C is {converted}F")
elif unit == "F":
    converted = (temp - 32) * 5 / 9
    print(f"{temp}F is {converted}C")
else:
    print("I don't understand that unit.")
```

**Try it yourself:**
- Round the answer to 1 decimal place (hint: `round()`)
- Add a third option: Kelvin

---

## 3. Number Guessing Game

**Goal:** practice `while` loops and conditionals.

The computer picks a number between 1 and 100, and the player keeps guessing until they get it right.

```python
secret = 42
guess = 0

while guess != secret:
    guess = int(input("Guess a number between 1 and 100: "))
    if guess < secret:
        print("Too low!")
    elif guess > secret:
        print("Too high!")

print("You got it!")
```

**Try it yourself:**
- Count how many guesses it took and print that at the end
- Look up the `random` module and use `random.randint()` to pick the secret number instead

---

## 4. List Wrangling

**Goal:** practice list creation, indexing, and loops.

```python
fruits = ["apple", "banana", "cherry", "date", "elderberry"]

# Print each fruit with its position
for i, fruit in enumerate(fruits):
    print(i, fruit)
```

**Try it yourself:**
- Print only the fruits with more than 5 letters
- Build a new list that contains every fruit in ALL CAPS
- Find and print the longest fruit name

---

## 5. Word Counter

**Goal:** practice strings, `.split()`, and dictionaries.

```python
sentence = "the quick brown fox jumps over the lazy dog the fox runs"
words = sentence.split()

counts = {}
for word in words:
    if word in counts:
        counts[word] += 1
    else:
        counts[word] = 1

print(counts)
```

**Try it yourself:**
- Print only words that appear more than once
- Ask the user to type in their own sentence instead of using a fixed one
- Find the most common word

---

## 6. Simple Functions Practice

**Goal:** practice writing and calling your own functions.

Write the following functions, then call each one with a couple of test inputs to prove they work:

```python
def is_even(n):
    # returns True if n is even, False otherwise
    pass

def square(n):
    # returns n squared
    pass

def reverse_string(s):
    # returns the string backwards
    pass
```

**Try it yourself:**
- Write a function `is_palindrome(s)` that returns `True` if a word reads the same forwards and backwards
- Write a function `average(numbers)` that takes a list and returns the average

---

## 7. Rock, Paper, Scissors

Build a Rock/Paper/Scissors game against the computer that:
- Picks a random choice for the computer
- Takes the player's choice as input
- Decides the winner

Here's a skeleton to start from:

```python
import random

choices = ["rock", "paper", "scissors"]

def get_winner(player, computer):
    # fill in the win conditions here
    pass

computer_choice = random.choice(choices)
player_choice = input("rock, paper, or scissors? ").lower()

result = get_winner(player_choice, computer_choice)
print(f"Computer chose {computer_choice}. Result: {result}")

play_again = input("Play again? (yes/no) ").lower()
```

**Try it yourself:**
- Add the ability for the game to be played multiple times in a row
- Keep score across rounds and print it at the end
- Validate the player's input (what if they type "rockk"?)

---

## 8. Advanced: Build an Akinator

**Goal:** show that "AI" can just mean a well-organized pile of `if`/`elif` statements.

You've probably played Akinator, the game that guesses a character by asking yes/no questions. If not, try it out here: [Akinator](https://en.akinator.com/game).

You're going to build a tiny version of it for animals.

Start with a simple, flat version using nested `if`/`elif`:

```python
print("Think of an animal, and answer yes or no.")

does_it_fly = input("Does it fly? ").lower()

if does_it_fly == "yes":
    has_feathers = input("Does it have feathers? ").lower()
    if has_feathers == "yes":
        print("Is it an eagle?")
    else:
        print("Is it a bat?")
else:
    lives_in_water = input("Does it live in water? ").lower()
    if lives_in_water == "yes":
        print("Is it a dolphin?")
    else:
        print("Is it a dog?")
```

This works, but it gets messy fast if you add more questions. A cleaner way to represent the same idea is a **decision tree** made of nested dictionaries, where each node is either a question or a final guess:

```python
tree = {
    "question": "Does it fly?",
    "yes": {
        "question": "Does it have feathers?",
        "yes": {"answer": "eagle"},
        "no": {"answer": "bat"},
    },
    "no": {
        "question": "Does it live in water?",
        "yes": {"answer": "dolphin"},
        "no": {"answer": "dog"},
    },
}

node = tree
while "question" in node:
    reply = input(node["question"] + " (yes/no) ").lower()
    node = node[reply]

print(f"Is it a {node['answer']}?")
```

**Try it yourself:**
- Add at more levels of questions to make the tree cover more animals
- Add a check for invalid answers (what if someone types "maybe"?)
- Ask the user at the end if the guess was correct, and print something different if the AI got it wrong

---

## 9. Advanced: Rule-Based Chatbot

**Goal:** Simulate a chatbot using nothing but string checks. This is roughly how the very first chatbots (like ELIZA, from the 1960s) worked.

```python
print("Chatbot: Hi, I'm a very simple chatbot. Type 'bye' to leave.")

while True:
    message = input("You: ").lower()

    if "bye" in message:
        print("Chatbot: Goodbye!")
        break
    elif "hello" in message or "hi" in message:
        print("Chatbot: Hello there!")
    elif "how are you" in message:
        print("Chatbot: I'm just a bunch of if-statements, but I'm doing great!")
    elif "name" in message:
        print("Chatbot: I don't really have a name. You could give me one!")
    elif "?" in message:
        print("Chatbot: That's a good question. I don't actually know.")
    else:
        print("Chatbot: Tell me more about that.")
```

Notice this "AI" has no real understanding; it's just doing string checks.

**Try it yourself:**
- Add at least 5 new rules for topics you want the bot to respond to
- Make the bot echo part of what the user said back at them, e.g. if the user says "I like pizza", the bot could respond "Why do you like pizza?" (hint: `.replace()` or splitting the sentence)
- Give the bot a "mood" variable that changes based on what the user says, and have some responses depend on the mood

---

## 11. Open-Ended: Pick Your Own Mini-Project

**Goal:** apply what you've learned to something you actually want to build.

Spend the rest of the workshop building something of your own choosing. If you're stuck for ideas, here are a few starting points — pick one, change it, or ignore all of them:

- A simple calculator that supports `+ - * /` from user input
- A to-do list manager that runs in the terminal
- A "Would You Rather" quiz that scores the player's answers
- A basic Mad Libs generator that reads prompts from a list instead of hardcoding them
- A dice-rolling simulator that rolls N dice and reports statistics
- A password strength checker

**Guidelines:**
- Plan before you code — write down 3–4 bullet points of what your program should do
- Ask for help framing the problem, not just for the answer — we're happy to help you think it through
