FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY build/libs/users-2.0.0.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "app.jar"]
