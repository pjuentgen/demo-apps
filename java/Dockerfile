FROM maven:3-eclipse-temurin-22-alpine as builder
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src/ ./src/
RUN mvn clean package -DskipTests=true

FROM eclipse-temurin:22-jdk-alpine as production
RUN mkdir /app
COPY --from=builder /app/target/*.jar /app/app.jar
ENV SERVER_PORT=8080
WORKDIR /app
EXPOSE 8080
CMD ["java","-jar","app.jar"]

