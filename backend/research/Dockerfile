FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY build/libs/research-2.0.0.jar app.jar
EXPOSE 8091
ENTRYPOINT ["java", "-jar", "app.jar"]
