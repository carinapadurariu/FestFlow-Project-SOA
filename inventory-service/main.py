import pika
import json
import time


try:
    from kafka import KafkaProducer
    KAFKA_AVAILABLE = True
except ImportError:
    KAFKA_AVAILABLE = False
    print(" [!] Libraria kafka-python nu este instalata via pip.")

producer = None
if KAFKA_AVAILABLE:
    try:
  
        producer = KafkaProducer(
            bootstrap_servers=['localhost:8092'], 
            value_serializer=lambda x: json.dumps(x).encode('utf-8')
        )
        print(" [OK] Conexiune Kafka reusita pe portul 8092!")
    except Exception as e:
        print(f" [!] Kafka nu este accesibil pe portul 8092. Eroare: {e}")
        print(" [!] Serviciul va continua doar cu RabbitMQ.")

def send_to_kafka(order):
    if producer:
        try:
            msg = {
                "event": "TICKET_SOLD",
                "details": f"User {order['user_id']} bought {order['ticket_type']}",
                "status": "CONFIRMED"
            }
            producer.send('analytics_topic', value=msg)
            print(f" [Kafka] Event sent: {msg}")
        except Exception as e:
            print(f" [Kafka Error] Nu am putut trimite: {e}")

def callback(ch, method, properties, body):
    order = json.loads(body)
    print(f" [Inventory] TICKET VANDUT! Procesez comanda pentru: {order['ticket_type']}")

    time.sleep(1)
  
    send_to_kafka(order)

    ch.basic_ack(delivery_tag=method.delivery_tag)

try:
    connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost', port=8672))
    channel = connection.channel()
    channel.queue_declare(queue='orders')

    channel.basic_consume(queue='orders', on_message_callback=callback)

    print(' [*] Inventory Service asteapta comenzi... (CTRL+C pentru iesire)')
    channel.start_consuming()
except Exception as e:
    print(f"CRITICAL ERROR la RabbitMQ: {e}")
    print("Verifica daca Docker ruleaza!")