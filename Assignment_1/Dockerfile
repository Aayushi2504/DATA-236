# Use Nginx as the base image
FROM nginx:alpine

# Copy only HTML, CSS, and JS files to the correct directory
COPY blog.html /usr/share/nginx/html/index.html
COPY blogscript.js /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]