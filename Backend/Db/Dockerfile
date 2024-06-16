FROM eclipse-temurin:17-jdk-jammy as builder
WORKDIR /opt/app
COPY ../mvn/ .mvn
COPY ../mvnw pom.xml ./
RUN .././mvnw dependency:go-offline
COPY ../src ./src
COPY .env.dev.properties /opt/app/.env.dev.properties
COPY .env.properties /opt/app/.env.properties
COPY src/main/resources/keystore/biddify.p12 /opt/app/src/main/resources/keystore/biddify.p12

RUN ./mvnw clean install -Pdev -DskipTests



FROM eclipse-temurin:17-jre-jammy
WORKDIR /opt/app
COPY ../../gendb/data /opt/gendb/data

COPY ../.env.dev.properties /opt/app/.env.dev.properties
COPY ../.env.properties /opt/app/.env.properties
COPY --from=builder /opt/app/src/main/resources/keystore/biddify.p12 /opt/app/src/main/resources/keystore/biddify.p12




EXPOSE 8080

COPY --from=builder /opt/app/target/*.jar /opt/app/*.jar

ENTRYPOINT ["java", "-jar", "/opt/app/*.jar","gendb"]