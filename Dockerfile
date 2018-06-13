FROM python:3.4-alpine

# Flask
CMD ["flask", "run", "--host=0.0.0.0"]
ENV PATH "$PATH:/root/.local/bin"
RUN pip install Flask requests --user

# Backend
WORKDIR /tntfl
ENV FLASK_APP=entry.py
COPY entry.py .
COPY tntfl tntfl

# Frontend
COPY dist dist
