FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY build/libs/examination-service-2.0.0.jar app.jar
EXPOSE 8084
ENTRYPOINT ["java", "-jar", "app.jar"]
