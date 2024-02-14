from flask import Flask, request, jsonify

from gptService import chat_gpt
from host import HostMessageParams, generate_observations

app = Flask(__name__)

@app.route('/chat-gpt', methods=['GET', 'POST'])
def chat_gpt_endpoint():
    if request.method == 'GET':
        return jsonify({'message': 'GET request received'})
    elif request.method == 'POST':
        data = request.json
        hostMess = data['hostMess']  

        params = HostMessageParams(
            correctAnswers=hostMess.get('correctAnswers', []),
            wrongAnswers=hostMess.get('wrongAnswers', []),
            playerPositions=hostMess.get('playerPositions', []),
            playerNames=hostMess.get('playerNames') 
        )

        response = chat_gpt(params)
        
        return jsonify({'response': response})
    

if __name__ == '__main__':
    app.run(debug=True)
  
