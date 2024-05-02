FROM python:3.10-slim
WORKDIR /app
COPY . /app
RUN pip install --no-cache-dir -r requirements.txt
EXPOSE 80
ENV NAME World
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "80"]