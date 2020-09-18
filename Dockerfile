FROM node:12.18.3-alpine
RUN apk add ffmpeg

COPY . /app
WORKDIR /app
RUN npm install
RUN npm run postinstall

CMD node parseENV.js
CMD npm run start