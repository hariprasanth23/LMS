FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY build/libs/auth-2.0.0.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
