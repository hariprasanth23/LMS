FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY build/libs/academics-service-2.0.0.jar app.jar
EXPOSE 8089
ENTRYPOINT ["java", "-jar", "app.jar"]
