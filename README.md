# Yoga

Cette application permet de créer et de gérer des séances de yoga ainsi que leurs participations.

Par défaut, les identifiants du compte admin sont :

- login: yoga@studio.com
- password: test!1234

---

## Prérequis

Avant de commencer, assurez-vous d'avoir les outils suivants :

- Angular CLI
- Node.js
- Java JDK (v11)
- Maven
- MySQL
- Git

---

## Installation :

Git clone:

> git clone https://github.com/OpenClassrooms-Student-Center/P5-Full-Stack-testing


Accédez au répertoire du projet :

> cd Testez-une-application-full-stack-master

---

## Base de données :

Lancez votre serveur MySQL.
Créez une base de données nommée `yoga` :

> CREATE DATABASE yoga;

   
Les identifiants pour la base de données sont configurés dans le fichier `application.properties` du back-end.

---

## Back-end :

### Installation


Accédez au répertoire du back-end :

> cd back

Installez les dépendances avec Maven :

> mvn clean install


### Lancez le Back-end


Démarrez le serveur Spring Boot :

> mvn spring-boot:run

Le back-end sera accessible à l'adresse :

> http://localhost:8080

---

## Front-end :


### Installation :


Accédez au répertoire du front-end :

> cd front

Installez les dépendances :

> npm install


### Lancez le Front-end:


Démarrez le serveur :

> npm run start;

Le front-end sera accessible à l'adresse :

> http://localhost:4200

---

## Tests


### Back-end :


Pour exécuter les tests du back-end avec JUnit5 :

> mvn test

Le rapport de couverture sera disponible dans ce dossier :

> back/target/site/jacoco/index.html


### Front-end


Pour exécuter les tests du front-end avec Jest :

> npm test

Pour obtenir le rapport de couverture :

> npm test -- --coverage


Pour exécuter les tests end-to-end avec Cypress :

> npm run e2e

Pour obtenir le rapport de couverture (les tests doivent avoir été effectués avant) :

> npm run e2e:coverage

Le rapport sera disponible dans ce dossier :

> front/coverage/lcov-report/index.html



