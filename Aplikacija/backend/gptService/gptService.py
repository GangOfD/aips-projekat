import os
import openai
import requests
from dotenv import load_dotenv
from openai import OpenAI

from host import generate_observations


load_dotenv()

api_key = os.getenv("GPT_API_KEY")

client = OpenAI(
    api_key=api_key,
)

PROMPT = "Act as if you were a game host. Give some roasting comments about the ones that did not answer or that answered incorrectly. Up to 3 sentences."

def chat_gpt(params):
    game_state = generate_observations(params)
    print(game_state)
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "user", "content": PROMPT},
            {"role": "system", "content": f"Game State: {', '.join(game_state)}"}
        ]
    )
    return response.choices[0].message.content.strip()




#print(chat_gpt("Act as if you were a game host. Give some comments"))