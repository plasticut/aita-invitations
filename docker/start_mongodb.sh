# !/bin/bash

echo "Creating mongodb replicas"
docker-compose -f docker/mongodb.yml up --build -d

echo "Initialize mongodb cluster"
sleep 5;
echo "rs.initiate({\"_id\":\"rs0\",\"members\":[{\"_id\":0,\"host\":\"mongo1:27017\"},{\"_id\":1,\"host\":\"mongo2:27017\"},{\"_id\":2,\"host\":\"mongo3:27017\"}]});" | docker exec --interactive mongo1 mongo -
