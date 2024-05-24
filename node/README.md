# Demo application
Demo applicaiton in Typescript that is listening on port 8080 (can be overwritten with ENV var `PORT`) and responding in a random time up to 500ms.
When the random time is >300 it will return http 500 otherwise http 200

`npm run dev` - Run application in development mode.
`npm run start` - Build the application and run the js file

Two docker-compose files are included:
For development build, use:

For development build, use:
`docker-compose -f docker-compose.dev.yml up`

For production build, use:
`docker-compose -f docker-compose.prod.yml up --build --remove-orphans`

A docker container of this application can be found here:
`ghcr.io/pjuentgen/node-demoapp:latest`

Options for environment variables
| Variable   | Descpription   | Default   |
|---|---|---|
| PORT | Port the service will listen on |8080|
| TIME | Time for random time generator |500|
| TIME_FOR_ERROR | Timethreshold for calls to mark as erroneous |300|
|READIENESS_DELAY| Time until the redieness endpoint replies | 0 (no delay)|
|REMOTE_URL|URL that is called with the /remote endpoint | https://api.chucknorris.io/jokes/random |



Build and push:
docker-compose -f docker-compose.prod.yml up --build --remove-orphans && \\
docker image tag node-demoapp ghcr.io/pjuentgen/node-demoapp && \\
docker push ghcr.io/pjuentgen/node-demoapp:latest 