FROM node:14.15.5-alpine3.12
WORKDIR /code
RUN mkdir react-app
COPY react-app/package.json react-app/
COPY react-app/yarn.lock react-app/
RUN cd react-app && yarn install
RUN yarn add --dev jest
CMD cd react-app && yarn start