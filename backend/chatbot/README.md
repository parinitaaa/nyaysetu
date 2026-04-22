cmd:-  ollama pull llama3.1:8b
       ollama pull mxbai-embed-large
       ollama serve

 backend terminal:      
pip install -r requirements.txt  
python chatbot/ingest.py 
python chatbot/test_chatbot.py
uvicorn app:app --reload




(venv) PS C:\Users\tina\practice\nyaysetu\backend> python -m chatbot.chumma
always run it like this as parent package is chatbot so run it as a module (chatbot.file_name)