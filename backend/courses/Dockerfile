FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY build/libs/courses-2.0.0.jar app.jar
EXPOSE 8083
ENTRYPOINT ["java", "-jar", "app.jar"]
