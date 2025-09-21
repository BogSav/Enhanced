FROM node:24-alpine
WORKDIR /app

# Install only the production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the source files 
# - will be copied only the files that are NOT mentioned in the .dockerignore
COPY . .

# Set up a non root user
ENV NODE_ENV=production
USER node

# Setup the service port
# - it has to correspond with the one used by the server
EXPOSE 8080

# Start the actual server after building the container
CMD ["npm", "run", "startProd"]