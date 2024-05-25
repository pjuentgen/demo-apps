FROM golang:1.22.3-bookworm as builder
WORKDIR /app
COPY go.mod ./
COPY *.go ./
RUN go build -o go-demoapp

FROM golang:1.22.3-bookworm as production
RUN mkdir /app
COPY --from=builder /app/go-demoapp /app/go-demoapp
WORKDIR /app
EXPOSE 8080
CMD ["sh", "-c", "/app/go-demoapp"]