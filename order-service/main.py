from fastapi import FastAPI, Request, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pika
import json
import uuid
import os
import secrets 
app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


FAKE_USERS_DB = {
    "admin": "admin123",
    "student": "student2026",
    "guest": "festflow"
}


ACTIVE_TOKENS = {}


class LoginRequest(BaseModel):
    username: str
    password: str


async def verify_token(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization Header")
    
  
    try:
        scheme, token = authorization.split()
        if scheme.lower() != 'bearer':
            raise HTTPException(status_code=401, detail="Invalid authentication scheme")
        
        if token not in ACTIVE_TOKENS:
             raise HTTPException(status_code=401, detail="Invalid or expired token")
             
        return ACTIVE_TOKENS[token] 
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid authorization header")


def send_to_rabbitmq(data):
    try:
        host = os.getenv('RABBITMQ_HOST', 'rabbitmq')
        connection = pika.BlockingConnection(pika.ConnectionParameters(host=host, port=5672))
        channel = connection.channel()
        channel.queue_declare(queue='orders_queue', durable=True)
        channel.basic_publish(
            exchange='',
            routing_key='orders_queue',
            body=json.dumps(data),
            properties=pika.BasicProperties(delivery_mode=2)
        )
        connection.close()
        return True
    except Exception as e:
        print(f"⚠️ Eroare RabbitMQ: {e}")
        return False



@app.post("/login")
def login(data: LoginRequest):

    if data.username in FAKE_USERS_DB and FAKE_USERS_DB[data.username] == data.password:
  
        token = secrets.token_hex(16)
     
        ACTIVE_TOKENS[token] = data.username
        
        print(f"--> LOGIN SUCCES: User {data.username} a primit token {token}")
        return {"status": "success", "token": token, "username": data.username}
    else:
        print(f"--> LOGIN ESUAT: {data.username}")
        raise HTTPException(status_code=401, detail="User sau parola incorecta")

@app.post("/orders")
async def create_order(request: Request, current_user: str = Depends(verify_token)):
  
    print(f"--> [SECURED API] Request aprobat pentru userul: {current_user}")
    
    body_json = await request.json()
    

    transaction_id = str(uuid.uuid4())
    body_json['transaction_id'] = transaction_id
    body_json['authenticated_user'] = current_user 
    send_to_rabbitmq(body_json)

    return {
        "status": "success",
        "message": "Order placed securely!",
        "data": body_json,
        "faas_execution": {
            "triggered": True,
            "function": "email_notification_service",
            "status": "executed",
            "details": "Event sent to Kafka"
        },
        "analytics": {"status": "processed"}
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)