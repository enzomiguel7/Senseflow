# SenseFlow 🕒🚶‍♂️

> **Project Status:** Production / Academic Final Project

---
🇺🇸 English


SenseFlow is a lightweight, real-time visitor tracking system. It records precisely when a person triggers a physical sensor and sends that data via the MQTT protocol to a web-based dashboard. This project is fully containerized using Docker for seamless deployment and scalability.

📡 How it Works
Sensor: An IoT device (e.g., ESP32 or PIR sensor) detects movement and publishes a message to a specific topic.

Broker: A Mosquitto MQTT broker manages the communication between the hardware and the software.

Interface: The web app subscribes to the broker and logs the visitor entry with a precise timestamp immediately.

✨ Key Features
Real-time Monitoring: Instant UI updates via MQTT subscriptions—no page refresh required.

Dockerized Environment: The entire stack (Broker + Web App) is containerized for "one-click" setup.

Efficient Messaging: Uses the MQTT protocol, ideal for low-latency IoT data flow.

Visitor History: A clean, chronological log of all pass-through events.

🛠️ Tech Stack
Protocol: MQTT (Mosquitto)

Containerization: Docker & Docker Compose

Backend: Node.js / Express

Frontend: HTML5, CSS3, JavaScript

🐳 Running with Docker
To launch the entire stack (Broker + App) instantly:

docker-compose up --build

Once the containers are running, access the dashboard at http://localhost:3000.

🚀 Manual Setup
Clone the repository: git clone https://www.google.com/search?q=https://github.com/enzomiguel7/Visitor-counter.git

Install dependencies: npm install

Start application: npm start

---

🇧🇷 Português


O SenseFlow é um sistema leve de monitoramento de visitantes em tempo real. Ele registra precisamente quando uma pessoa aciona um sensor físico e envia esses dados via protocolo MQTT para um painel web. O projeto é totalmente conteinerizado com Docker para facilitar a execução e implantação.

📡 Como Funciona
Sensor: Um dispositivo IoT (ex: ESP32 ou sensor PIR) detecta o movimento e publica uma mensagem em um tópico específico.

Broker: Um broker MQTT Mosquitto gerencia a comunicação entre o hardware e o software.

Interface: A aplicação web assina o tópico no broker e registra a entrada do visitante com um carimbo de data/hora instantaneamente.

✨ Funcionalidades
Monitoramento em Tempo Real: Atualizações instantâneas na interface via MQTT—sem necessidade de atualizar a página.

Ambiente Dockerizado: Todo o sistema (Broker + App Web) roda em containers para uma configuração rápida.

Mensageria Eficiente: Utiliza o protocolo MQTT, ideal para fluxo de dados IoT de baixa latência.

Histórico de Visitantes: Log cronológico organizado de todos os eventos registrados.

🛠️ Tecnologias
Protocolo: MQTT (Mosquitto)

Conteinerização: Docker & Docker Compose

Backend: Node.js / Express

Frontend: HTML5, CSS3, JavaScript

🐳 Executando com Docker
Para iniciar todo o sistema (Broker + App) instantaneamente:

docker-compose up --build

Após iniciar, acesse o painel em http://localhost:3000.

🎓 Contexto Acadêmico
Este projeto foi desenvolvido como um Trabalho de Conclusão/Projeto Integrador, focando na aplicação prática de Internet das Coisas (IoT), protocolos de rede e práticas modernas de DevOps (Docker).
