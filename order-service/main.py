from fastapi import FastAPI, HTTPException, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pika
import json
import asyncio

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


RABBITMQ_HOST = 'localhost'
RABBITMQ_PORT = 8672

def send_to_rabbitmq(order_data):
    try:
        connection = pika.BlockingConnection(pika.ConnectionParameters(host=RABBITMQ_HOST, port=RABBITMQ_PORT))
        channel = connection.channel()
        channel.queue_declare(queue='orders')
        channel.basic_publish(exchange='', routing_key='orders', body=json.dumps(order_data))
        connection.close()
        return True
    except Exception as e:
        print(f"Eroare RabbitMQ: {e}")
        return False

class Order(BaseModel):
    user_id: str
    ticket_type: str


class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
         
            await websocket.receive_text()
    except:
        manager.disconnect(websocket)

@app.post("/orders")
async def place_order(order: Order):
    print(f" [x] Order received: {order}")
    

    success = send_to_rabbitmq(order.dict())
    
    if success:
    
        await manager.broadcast(json.dumps({
            "type": "NOTIFICATION",
            "message": f"🚀 New Order Placed: {order.ticket_type} ticket sold!"
        }))
        return {"status": "SUCCESS", "message": "Order sent to RabbitMQ"}
    else:
        raise HTTPException(status_code=500, detail="RabbitMQ Connection Failed")

@app.get("/")
def read_root():
    return {"status": "Order Service is Running"}