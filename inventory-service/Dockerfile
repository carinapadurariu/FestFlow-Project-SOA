FROM python:3.9-slim

WORKDIR /app

# Instalam librariile necesare (inclusiv driverul de PostgreSQL si Kafka)
RUN pip install kafka-python pika psycopg2-binary

COPY . .

# Pornim scriptul (folosind -u pentru a vedea logurile imediat)
CMD ["python", "-u", "main.py"]