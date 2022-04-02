'use strict';

const formidable = require('formidable');
const stream = require('stream');
const fs = require('fs');

const {BaseConnection, BaseConnectionError} = require('../interfaces/base.connection');

class HttpConnectionError extends BaseConnectionError {}

class HttpConnection extends BaseConnection {
  constructor({req, res}) {
    super();
    this.request = req;
    this.response = res;
  }

  route() {
    const {request} = this;
    const {url, method} = request;
    return {path: url, method};
  }

  async payload() {
    const {request} = this;
    const chunks = [];
    for await (const chunk of request) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks).toString();
    return buffer;
  }

  async multiform() {
    const {request} = this;
    const form = new formidable.IncomingForm({
      maxFiles: 1,
    });
    const clear = async (files) =>
      Promise.all(files.map((filepath) => fs.promises.rm(filepath))).then(() => files);
    return new Promise((res, rej) => {
      form.parse(request, (err, fields, files = {}) => {
        if (err) return rej(err);
        const filepaths = Object.keys(files)
          .map((file) => files?.[file]?.filepath)
          .filter((f) => !!f);
        res({
          files: files,
          data: fields,
          clear: clear.bind(null, filepaths),
        });
      });
    });
  }

  async send(data) {
    const {response} = this;
    response.writeHead(200);
    if (data instanceof stream.Readable) {
      return data.pipe(response);
    }
    if (typeof data === 'string') {
      return response.end(data);
    }
  }

  async destroy() {
    const {response} = this;
    return response.destroy();
  }
}
module.exports = {HttpConnection, HttpConnectionError};
