FROM kaezarrex/python-nodejs

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app/
RUN chmod -x install.sh
RUN rm -rf ./node_modules && npm cache clean && npm install

CMD [ "npm", "start" ]

EXPOSE 3000
