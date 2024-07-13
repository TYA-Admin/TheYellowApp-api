# TheYellowApp-api

# Node Version - 18.19.0


## Build Docker Locally
docker build -t greatnight-api .
docker run -t greatnight-api .

docker stop greatnight-dev
docker rm greatnight-dev

docker logs greatnight-dev

## Build locally w/o Docker
npm run start:dev
