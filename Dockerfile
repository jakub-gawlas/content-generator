FROM node:8.2.1-alpine

WORKDIR /app

# Install dependencies
COPY package.json yarn.lock /app/
RUN yarn

# Copy app sources
COPY src/ /app/src/

# Set env vars
ENV APP_SRC_PATH /src/docu
ENV APP_DOCU_CONFIG_PATH /src/docu.config.json
ENV APP_OUT_PATH /out

CMD ["npm", "start"]
