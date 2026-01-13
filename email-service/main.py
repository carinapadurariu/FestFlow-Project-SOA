import json
import time
import random


try:
    from kafka import KafkaConsumer
    KAFKA_AVAILABLE = True
except ImportError:
    KAFKA_AVAILABLE = False
    print(" [!] Te rog instaleaza: pip install kafka-python")

def start_email_faas():
    if not KAFKA_AVAILABLE:
        return

    print(" [✉️] Email FaaS Service porneste... Astept evenimente din Kafka.")

    # conectare Kafka
    consumer = None
    while not consumer:
        try:
            consumer = KafkaConsumer(
                'analytics_topic', 
                bootstrap_servers=['localhost:8092'],
                auto_offset_reset='latest',
                value_deserializer=lambda x: json.loads(x.decode('utf-8'))
            )
            print(" [✅] FaaS conectat la Kafka!")
        except Exception as e:
            print(" [⏳] Astept Kafka... (Retrying in 5s)")
            time.sleep(5)

    
    for message in consumer:
        event = message.value
        
        print("\n" + "="*40)
        print(f" [🚀 FaaS TRIGGERED] Eveniment primit: {event.get('event', 'Unknown')}")
        print(f" [📄] Generare PDF Ticket pentru: {event.get('type', 'General Access')}")
        
      
        time.sleep(1) 
        
        email_id = random.randint(1000, 9999)
        print(f" [📧] SENDING EMAIL #{email_id} to user...")
        print(" [✅] DONE. Email sent.")
        print("="*40 + "\n")

if __name__ == "__main__":
    start_email_faas()