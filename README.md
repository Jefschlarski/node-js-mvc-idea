# node-js-mvc-idea
Pequeno sistema com crud basico para criar e interagir com ideias. Foi criado em nodejs e express utilizando a arquitetura mvc, ele conta com autenticação e session via filestore, utiliza sequelize como orm e o mysql como banco de dados. O handlebars é utilizado como engine para as views.


comandos importantes 

npx sequelize-cli init 
npx sequelize-cli seed:generate --name demo-user  
npx sequelize db:seed:all
npx sequelize-cli db:seed --seed 20240915213211-demo-user.js

docker network create idea_network
docker network inspect idea_network
docker network connect idea_network mysql

docker-compose -f docker-compose.dev.yml up --build -d