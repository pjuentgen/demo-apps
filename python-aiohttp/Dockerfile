FROM python:3.8-slim

RUN pip install pipenv

ENV SRC_DIR /python-demoapp

WORKDIR ${SRC_DIR}

COPY Pipfile Pipfile.lock ${SRC_DIR}/
RUN pipenv install --system --clear

COPY ./src ${SRC_DIR}/

CMD ["python", "/src/webapp/app.py"]
