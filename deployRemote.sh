#!/bin/bash

# Stelle sicher, dass dieses Skript mit ausreichenden Berechtigungen ausgeführt wird.

# Führe npm run build aus
npm run build

# Definiere den lokalen Pfad zum Build-Ordner und den Zielort auf dem Server
LOCAL_BUILD_DIR="./build/" # Lokaler Pfad zum Build-Ordner
REMOTE_DIR="/var/www/html" # Pfad auf dem Server

# Führe SFTP-Übertragung durch
sftp leonid@217.72.204.244 << EOF
put -r $LOCAL_BUILD_DIR $REMOTE_DIR
EOF

echo "Übertragung abgeschlossen."
