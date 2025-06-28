# Build stage: Compile the Go application
FROM golang:1.22-alpine AS builder 
WORKDIR /app 

# Copy Go module files and download dependencies for caching
COPY go.mod go.sum ./
RUN go mod download

# Copy the rest of the application code
COPY . .

# Build the Go binary (statically linked for a smaller final image)
RUN CGO_ENABLED=0 GOOS=linux go build -a -ldflags '-extldflags "-static"' -o url_shortener .

# Final stage: Create a minimal production image
FROM alpine:latest 
WORKDIR /app 

# Copy the compiled binary from the builder stage
COPY --from=builder /app/url_shortener .

# Expose the port your backend service listens on
EXPOSE 8000  

# Define the command to run the application
CMD ["./url_shortener"]



# /backend/Dockerfile

# FROM golang:1.20-alpine AS builder
# WORKDIR /app
# COPY go.mod go.sum ./
# RUN go mod download
# COPY . .
# RUN go build -o myapp .

# FROM alpine:latest
# WORKDIR /root/
# COPY --from=builder /app/myapp .
# EXPOSE 8080
# ENTRYPOINT ["./myapp"]
