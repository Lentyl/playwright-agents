FROM nexus.office.local/playwright:v1.62.1-jammy

WORKDIR /app

RUN mkdir -p /app/test-results && chmod 1777 /app/test-results

COPY package*.json ./

RUN npm ci
