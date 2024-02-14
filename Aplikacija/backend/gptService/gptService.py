import os
import openai
import requests
from dotenv import load_dotenv
from openai import OpenAI

from host import generate_observations


load_dotenv()

api_key = os.getenv("GPT_API_KEY")

def calculate_game_state():
    observations = [
        "Player Katrin is now in first place.",
        "The game is currently in an active state.",
        "Player Marko is the only one that got his answer wrong"
    ]
    return observations

client = OpenAI(
    api_key=api_key,
)

PROMPT = "Act as if you were a game host. Give some roasting comments, up to 3 sentences."

def chat_gpt(params):
    game_state = generate_observations(params)
    #game_state = "Interesting game so far"
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "user", "content": PROMPT},
            {"role": "system", "content": f"Game State: {', '.join(game_state)}"}
        ]
    )
    return response.choices[0].message.content.strip()




#print(chat_gpt("Act as if you were a game host. Give some comments"))