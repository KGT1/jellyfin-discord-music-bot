FROM node:12

COPY package.json /app
RUN npm install
COPY . /app
RUN npm run postinstall

CMD node parseENV.js
CMD npm run start