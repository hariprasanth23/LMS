FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY build/libs/student-services-2.0.0.jar app.jar
EXPOSE 8092
ENTRYPOINT ["java", "-jar", "app.jar"]
