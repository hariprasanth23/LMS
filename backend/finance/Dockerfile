FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY build/libs/finance-2.0.0.jar app.jar
EXPOSE 8086
ENTRYPOINT ["java", "-jar", "app.jar"]
