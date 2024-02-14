from tokenize import String
from typing import List
from dataclasses import dataclass

@dataclass
class HostMessageParams:
    correctAnswers: List[bool]
    wrongAnswers: List[bool]
    playerPositions: List[int]
    playerNames:List[str]

def generate_observations(params: HostMessageParams) -> List[str]:
    observations = []

    playerNames = params.playerNames if params.playerNames else [f"Player {i+1}" for i in range(max(len(params.correctAnswers), len(params.wrongAnswers), len(params.playerPositions)))]

    for i, is_correct in enumerate(params.correctAnswers):
        player_name = playerNames[i] if i < len(playerNames) else f"Player {i + 1}"
        if is_correct:
            observations.append(f"{player_name} answered the question correctly.")
        else:
            observations.append(f"{player_name} answered the question incorrectly.")

    for i, is_wrong in enumerate(params.wrongAnswers):
        if is_wrong:
            player_name = playerNames[i] if i < len(playerNames) else f"Player {i + 1}"
            observations.append(f"{player_name} answered the question incorrectly.")

    for i, position in enumerate(params.playerPositions):
        player_name = playerNames[i] if i < len(playerNames) else f"Player {i + 1}"
        observations.append(f"{player_name} is in position {position}.")

    observations.append("The game is currently in an active state.")
    return observations
