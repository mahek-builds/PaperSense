import requests

url = "https://hirdesh.app.n8n.cloud/webhook/open-ai-api"

data = {
    "message": "Explain AI"
}

response = requests.post(url, json=data)

print("Response:", response.text)