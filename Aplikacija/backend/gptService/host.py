from tokenize import String
from typing import List
from dataclasses import dataclass

@dataclass
class HostMessageParams:
    correctAnswers: List[bool]
    hasAnswered: List[bool]
    playerPositions: List[int]
    playerNames:List[str]

def generate_observations(params: HostMessageParams) -> List[str]:
    observations = []

    playerNames = params.playerNames if params.playerNames else [f"Player {i+1}" for i in range(max(len(params.correctAnswers), len(params.hasAnswered), len(params.playerPositions)))]

    for i, is_correct in enumerate(params.correctAnswers):
        player_name = playerNames[i] if i < len(playerNames) else f"Player {i + 1}"
        if is_correct:
            observations.append(f"{player_name} answered the question correctly.")

    for i, is_answered in enumerate(params.hasAnswered):
        if is_answered:
            player_name = playerNames[i] if i < len(playerNames) else f"Player {i + 1}"
            observations.append(f"{player_name} answered the question.")
        else:
            player_name = playerNames[i] if i < len(playerNames) else f"Player {i + 1}"
            observations.append(f"{player_name} did not answer the question.")


    for i, position in enumerate(params.playerPositions):
        player_name = playerNames[i] if i < len(playerNames) else f"Player {i + 1}"
        observations.append(f"{player_name} is in position {position}.")

    observations.append("The game is currently in an active state.")
    return observations
