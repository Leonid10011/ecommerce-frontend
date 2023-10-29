import random
import requests
import json

# Listen von Marken, Kategorien und Beschreibungen
marken = ["Lionfur", "Treespark", "Waterflow", "PaperWhite", "LeafGreen", "AsoluteWarmth"]
kategorien = [1, 2, 3]
beschreibungen = [
    "Ein großartiges Produkt für Ihren Kleiderschrank.",
    "Das perfekte Kleidungsstück für jede Gelegenheit.",
    "Hohe Qualität und Stil vereint in einem Produkt."
]

url = "http://localhost:8090/product/createWithURL"

for _ in range(200):
    name = f"{random.choice(marken)} {random.choice(kategorien)}"
    beschreibung = random.choice(beschreibungen)
    preis = round(random.uniform(10, 100), 2)
    kategorieID = random.choice(kategorien)

    data = {
        "name": name,
        "description": beschreibung,
        "price": preis,
        "categoryID": kategorieID,
        "quantity": 100,
        "imageURL": "test2.jpeg" 
    }

    json_data = json.dumps(data)

    headers = {'Content-Type': 'application/json'}

    response = requests.post(url, data=json_data, headers=headers)

    if(response.status_code == 201):
        print("success")
    else:
        print("Fail")

