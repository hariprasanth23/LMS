FROM eclipse-temurin:21-jre-alpine AS runtime
WORKDIR /app

# Build stage
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /build
COPY gradle/ gradle/
COPY gradlew settings.gradle build.gradle ./
RUN ./gradlew dependencies --no-daemon
COPY src/ src/
RUN ./gradlew bootJar --no-daemon

FROM runtime
COPY --from=builder /build/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
