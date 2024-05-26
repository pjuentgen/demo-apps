FROM python:3.8-slim

RUN pip install pipenv

ENV SRC_DIR /python-demoapp

WORKDIR ${SRC_DIR}

COPY Pipfile Pipfile.lock ${SRC_DIR}/
RUN pipenv install --system --clear

COPY ./src ${SRC_DIR}/
COPY files/run-gunicorn /usr/local/bin/
RUN chmod +x /usr/local/bin/run-gunicorn

# CMD ["flask", "run", "-h", "0.0.0.0", "-p", "8080"]
# CMD ["python", "/src/webapp/app.py"]
CMD ["run-gunicorn"]