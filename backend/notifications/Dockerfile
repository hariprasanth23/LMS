FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY build/libs/notifications-2.0.0.jar app.jar
EXPOSE 8088
ENTRYPOINT ["java", "-jar", "app.jar"]
