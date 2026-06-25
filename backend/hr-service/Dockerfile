FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY build/libs/hr-service-2.0.0.jar app.jar
EXPOSE 8087
ENTRYPOINT ["java", "-jar", "app.jar"]
