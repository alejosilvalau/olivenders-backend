# Adapt this Dockerfile to the code below apart from creating a container for the server itself.
# docker volume create mongo-data
# docker run --name mongodb-dsw \
#   -v mongo-data:/data/db \
#   -p 27017:27017 -d percona/percona-server-mongodb:latest
