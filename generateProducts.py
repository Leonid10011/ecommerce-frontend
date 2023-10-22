import random

# Listen von Marken, Kategorien und Beschreibungen
marken = ["Lionfur", "Treespark", "Waterflow"]
kategorien = [1, 2, 3]
beschreibungen = [
    "Ein großartiges Produkt für Ihren Kleiderschrank.",
    "Das perfekte Kleidungsstück für jede Gelegenheit.",
    "Hohe Qualität und Stil vereint in einem Produkt."
]

# Generiere 100 Insert-Befehle
insert_befehle = []
for _ in range(200):
    name = f"{random.choice(marken)} {random.choice(kategorien)} Produkt"
    beschreibung = random.choice(beschreibungen)
    preis = round(random.uniform(10, 100), 2)
    kategorieID = random.choice(kategorien)
    insert_befehl = f"INSERT INTO Product (name, description, price, categoryID) VALUES ('{name}', '{beschreibung}', {preis}, {kategorieID});"
    insert_befehle.append(insert_befehl)

# Drucke die Insert-Befehle
for bef in insert_befehle:
    print(bef)
