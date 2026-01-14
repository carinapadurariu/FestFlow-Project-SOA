FestFlow - Distributed Ticketing Platform


The system is built as a distributed system composed of autonomous services running in Docker containers.
Data Flow
1.	Client (Frontend): The React application sends secured requests to the API.
2.	API Gateway (Nginx): Acts as a Load Balancer and Reverse Proxy, routing traffic to backend services.
3.	Order Service (REST API): Receives the order, validates the security token, and pushes the command asynchronously to RabbitMQ (Command Pattern).
4.	Inventory Service (Worker): Consumes messages from RabbitMQ, processes stock updates, and emits domain events (TICKET_SOLD) to Kafka.
5.	Email Service (FaaS): A stateless function that listens to Kafka events and triggers notifications.


 Grading Requirements Met (Checklist)
This project fulfills the criteria for the maximum grade (Grade S):
•	Web Server & Secured REST API:
o	Implemented in order-service using FastAPI.
o	Security: Uses Bearer Token (JWT) to authenticate critical endpoints (Checkout).
•	Scalability & Load Balancing:
o	Uses Nginx as an API Gateway to distribute traffic and conceal the internal network topology.
•	 Communication (Message Broker):
o	Uses RabbitMQ to decouple the Order placement process from Stock processing (ensures Low Latency).
•	 Event Streaming:
o	Uses Apache Kafka to stream domain events (TICKET_SOLD) to other systems (e.g., Analytics, Email).
•	 FaaS (Function as a Service):
o	The email-service acts as a reactive FaaS, triggered exclusively by events.
•	Web App & Server-Side Notifications:
o	React application with Micro-frontend architecture.
o	Real-time notifications via WebSockets (User receives confirmation without page refresh).
•	Containers:
o	The entire solution is containerized and orchestrated via Docker Compose.


Tech Stack
•	Frontend: React.js, WebSockets
•	Backend: Python 3.9 (FastAPI)
•	Message Broker: RabbitMQ (AMQP)
•	Event Streaming: Apache Kafka & Zookeeper
•	Infrastructure: Docker, Docker Compose, Nginx



 Installation & Running
Prerequisites
•	Docker Desktop installed and running.
Step 1: Start the System
Run the following command in the project root to build and start all containers:

Step 2: Access
•	Web App: http://localhost:3000
•	RabbitMQ Dashboard: http://localhost:15672 (User: guest, Pass: guest)
•	API Docs: http://localhost:8000/docs

 Demo Scenarios (Testing Guide)
The system implements Role-Based Access Control (RBAC). You can test two different flows:
 1. ADMINISTRATOR Role
•	Login: User: admin / Password: admin123
•	Capabilities:
1.	Access ADMIN DASHBOARD (top right).
2.	View the Sales Area Chart and Real-time System Logs.
3.	Go to the TICKETS page.
4.	Observe the STOCK counter on each ticket.
5.	Modify price or stock manually and click SAVE CHANGES.
 2. CLIENT (User) Role
•	Login: User: guest / Password: festflow
•	Capabilities:
1.	View tickets with prices set by the Admin.
2.	Add tickets to the Cart.
3.	Click CHECKOUT.
4.	Observe the Real-time Notification (bell icon) confirming asynchronous processing.

