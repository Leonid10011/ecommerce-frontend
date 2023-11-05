import random
import json

makes =[
    {
        "name": "Azure Elegance",
        "description": "Eine Marke, die sich auf luxuriöse Abendkleider spezialisiert. Ihre Designs zeichnen sich durch elegante Silhouetten, feinste Stoffe und eine auffällige, aber geschmackvolle Verwendung von Blautönen aus."
    },
    {
        "name": "Wild Ember",
        "description": "Eine trendige Streetwear-Marke, die mutige und lebendige Muster mit bequemer, urbaner Kleidung kombiniert. Ideal für diejenigen, die im Alltag ein Statement setzen wollen."
    },
    {
        "name": "Green Thread",
        "description": "Diese Marke fokussiert sich auf Nachhaltigkeit und ethische Herstellungsverfahren. Ihre Kleidung wird aus umweltfreundlichen Materialien gefertigt und spricht ein umweltbewusstes Publikum an."
    },
    {
        "name": "NeoVintage Vogue",
        "description": "Eine Marke, die Vintage-Mode mit modernen Elementen neu interpretiert. Von Retro-inspirierten Jacken bis hin zu Kleidern mit einem Hauch von Nostalgie, perfekt für Liebhaber des klassischen Stils."
    },
    {
        "name": "Galactic Gear",
        "description": "Eine futuristische Marke, die Kleidung mit High-Tech-Funktionen und außerirdisch inspiriertem Design anbietet. Ideal für Trendsetter, die Mode aus der Zukunft tragen möchten."
    }
]

# Listen von Marken, Kategorien und Beschreibungen
marken = ["Lionfur", "Treespark", "Waterflow"]
kategorien = [1, 2, 3, 4, 5]
ad = ['Crewneck', 'Wool', 'Knitwear', 'Cashmere', 'Jumper', 'Oversized', 'Sweatshirt', 'Turtleneck', 'Cardigan']
beschreibungen = [
    "Ein großartiges Produkt für Ihren Kleiderschrank.",
    "Das perfekte Kleidungsstück für jede Gelegenheit.",
    "Hohe Qualität und Stil vereint in einem Produkt."
]

# Generiere 100 Insert-Befehle
insert_befehle = []
for _ in range(200):
    adSingle = random.choice(ad)
    name = f"{random.choice(makes)['name']} {adSingle} Hoodie"
    beschreibung = random.choice(beschreibungen)
    preis = round(random.uniform(10, 100), 2)
    kategorieID = random.choice(kategorien)
    imgUrl = "http://87.106.115.218/images/" + name.replace(" ", "_") + ".png"
    print(name , "\n" ,beschreibung , "\n" , preis , "\n" , imgUrl)
    insert_befehle.append({
        'name': name,
        'description': beschreibung,
        'price': preis,
        'categoryID': 1,
        'quantity': 100,
        'imgURL': imgUrl
    })
    #insert_befehl = f"INSERT INTO Product (name, description, price, categoryID, quantity, imgURL) VALUES ('{name}', '{beschreibung}', {preis}, 1, 100, '{imgUrl}');"
    #insert_befehle.append(insert_befehl)

import requests

# URL des Endpoints
url = "http://85.215.54.122/product/create"

# Für jeden Befehl eine POST-Anfrage senden
for befehl in insert_befehle:
    response = requests.post(url, data=json.dumps(befehl), headers={'Content-Type': 'application/json', 'Accept': 'application/json'})
    if response.status_code == 201:
        print(f"Erfolgreich gesendet: {befehl}")
    else:
        print(f"Fehler beim Senden: {befehl}, Statuscode: {response.status_code}")
