FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY build/libs/attendance-service-2.0.0.jar app.jar
EXPOSE 8085
ENTRYPOINT ["java", "-jar", "app.jar"]
