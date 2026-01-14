import time
import json
import os
import threading
from kafka import KafkaConsumer, KafkaProducer
import pika
import psycopg2

KAFKA_BROKER = os.getenv('KAFKA_BOOTSTRAP_SERVERS', 'kafka:29092')
RABBIT_HOST = os.getenv('RABBITMQ_HOST', 'rabbitmq')
DB_URL = os.getenv('DATABASE_URL', 'postgresql://user:password@db:5432/festflow')

print(f"--> [Inventory] STARTING... Config: Kafka={KAFKA_BROKER}, Rabbit={RABBIT_HOST}")


def trigger_faas_email(order_data):
    try:
        producer = KafkaProducer(
            bootstrap_servers=KAFKA_BROKER,
            value_serializer=lambda v: json.dumps(v).encode('utf-8')
        )
        
        producer.send('email_notifications', order_data)
        producer.flush()
        print(f"--> [Inventory] 📢 Eveniment trimis la FaaS (Email): {order_data.get('email', 'unknown')}")
    except Exception as e:
        print(f" [!] Eroare trimitere Kafka: {e}")


def save_to_db(order_data, source):
    try:
        conn = psycopg2.connect(DB_URL)
        cur = conn.cursor()
        
        cur.execute("""
            CREATE TABLE IF NOT EXISTS processed_orders (
                id SERIAL PRIMARY KEY,
                order_id TEXT,
                total FLOAT,
                source TEXT,
                created_at TIMESTAMP DEFAULT NOW()
            );
        """)
        
        t_id = order_data.get('transaction_id') or order_data.get('order_id') or 'N/A'
        total = order_data.get('total') or order_data.get('total_amount') or 0
        
        cur.execute(
            "INSERT INTO processed_orders (order_id, total, source) VALUES (%s, %s, %s)",
            (t_id, total, source)
        )
        conn.commit()
        cur.close()
        conn.close()
        print(f" [✅] Comanda salvata in DB (Sursa: {source})")
        
      
        trigger_faas_email(order_data)
        
    except Exception as e:
        print(f" [!] DB Error: {e}")

def callback_rabbitmq(ch, method, properties, body):
    print(f" [x] RabbitMQ a primit comanda: {body}")
    try:
        data = json.loads(body)
        save_to_db(data, source="RabbitMQ")
    except Exception as e:
        print(f" [!] Eroare procesare: {e}")

def start_rabbitmq():
    while True:
        try:
            print(f" [⏳] Conectare RabbitMQ ({RABBIT_HOST})...")
            connection = pika.BlockingConnection(pika.ConnectionParameters(host=RABBIT_HOST))
            channel = connection.channel()
            channel.queue_declare(queue='orders_queue', durable=True)
            print(" [*] RabbitMQ Connected! Astept comenzi...")
            channel.basic_consume(queue='orders_queue', on_message_callback=callback_rabbitmq, auto_ack=True)
            channel.start_consuming()
        except Exception as e:
            print(f" [!] Rabbit Error: {e}. Retry 5s...")
            time.sleep(5)

if __name__ == "__main__":
    start_rabbitmq()