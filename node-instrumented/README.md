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



This demo application can easiely be used for docker:

`docker run -ti -e PORT=8080 -e TIME=500 ghcr.io/pjuentgen/node-demoapp:latest`

and this is an example deployment for K8s (for more details about OpenTelemetry deployments on K8s take a look at: [my other git repo](https://github.com/pjuentgen/demo-configs/tree/main/k8s)).
You can just run `kubectl apply -f https://raw.githubusercontent.com/pjuentgen/demo-configs/main/k8s/demo-app/demoapp-deployment.yaml` to deploy the app:

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: node-demoapp
  labels:
    app: node-demoapp
spec:
  selector:
    matchLabels:
      app: node-demoapp
  replicas: 2
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    metadata:
      labels:
        app: node-demoapp
      annotations:
        instrumentation.opentelemetry.io/inject-nodejs: "true"        
    spec:
      containers:
      - name: node-demoapp
        image: ghcr.io/pjuentgen/node-demoapp:latest
        imagePullPolicy: Always
        env:           
          - name: OTEL_LOG_LEVEL
            value: "info"
          - name: PORT
            value: "8080"
          - name: TIME
            value: "500"
        ports:
        - containerPort: 8080
        livenessProbe:
          httpGet:
            path: /liveness
            port: 8080
          initialDelaySeconds: 3
          periodSeconds: 3          
        resources:
          requests:
            memory: "64Mi"
            cpu: "50m"
          limits:
            memory: "256Mi"
            cpu: "500m"      
```
