from kafka import KafkaConsumer
import json

print(" [*] Analytics Service porneste... Ascult Topic-ul Kafka.")

consumer = KafkaConsumer(
    'analytics_topic',
    bootstrap_servers=['localhost:8092'],
    auto_offset_reset='latest',
    value_deserializer=lambda x: json.loads(x.decode('utf-8'))
)

for message in consumer:
    event = message.value
    print(f" [DASHBOARD] Bilet vandut: {event['type']} (Event primit prin Kafka)")