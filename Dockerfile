FROM nginx:latest

# Copy the static website
# Use the .dockerignore file to control what ends up inside the image!
COPY build /usr/share/nginx/html

