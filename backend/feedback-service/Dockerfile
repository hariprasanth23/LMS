FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY build/libs/feedback-service-2.0.0.jar app.jar
EXPOSE 8090
ENTRYPOINT ["java", "-jar", "app.jar"]
