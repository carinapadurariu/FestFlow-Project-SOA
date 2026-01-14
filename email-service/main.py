import json
import os
import time
from kafka import KafkaConsumer


KAFKA_BROKER = os.getenv('KAFKA_BOOTSTRAP_SERVERS', 'kafka:29092')
TOPIC = 'email_notifications'

print(f"--> [FaaS Email] STARTING... Listening on Kafka: {KAFKA_BROKER}")

def send_email_simulation(data):
    print("\n" + "*"*40)
    print("📧  [FaaS EXECUTED] TRIMITERE EMAIL")
    print(f"To: {data.get('email', 'guest@festflow.com')}")
    print(f"Subject: Confirmare Comanda #{data.get('transaction_id', '???')}")
    print(f"Total: {data.get('total', 0)} RON")
    print("Status: SENT ✅")
    print("*"*40 + "\n")

def start_faas_consumer():
    while True:
        try:
            consumer = KafkaConsumer(
                TOPIC,
                bootstrap_servers=KAFKA_BROKER,
                auto_offset_reset='latest',
                group_id='email_faas_group',
                value_deserializer=lambda x: json.loads(x.decode('utf-8'))
            )
            print(f" [*] FaaS Email Connected! Astept evenimente pe topicul '{TOPIC}'...")
            
            for message in consumer:
                print(f" [⚡] Eveniment detectat! Triggering function...")
                send_email_simulation(message.value)
                
        except Exception as e:
            print(f" [!] Kafka Connection Error: {e}. Retrying in 5s...")
            time.sleep(5)

if __name__ == "__main__":
    start_faas_consumer()