'use strict';

const fs = require('fs');
const http = require('http');
const FormData = require('form-data');
const crypto = require('crypto');

const generateLargeFile = async (path, salt, iterations) => {
  const writebleFileStream = fs.createWriteStream(path, 'utf-8');
  for (let i = 0; i < iterations; i++) {
    await new Promise((res, rej) => {
      writebleFileStream.write(salt, (err) => {
        if (err) rej(err);
        res();
      });
    });
  }
  await new Promise((res) => writebleFileStream.close(res));
};

const getChecksum = async (filepath) => {
  const hasher = crypto.createHash('md5');
  hasher.setEncoding('base64url');
  const hash = await new Promise((res, rej) => {
    const fileStream = fs.createReadStream(filepath);
    fileStream
      .on('end', () => {
        hasher.end();
        const hash = hasher.read();
        res(hash);
      })
      .on('error', (err) => rej(err));
    fileStream.pipe(hasher);
  });
  return hash;
};

const rm = (path) => fs.promises.rm(path, {recursive: true});

const test = async () => {
  const path = './upload-file.data';
  const salt = 'UPLOAD MULTIPART DATA TEST\n';
  try {
    await generateLargeFile(path, salt, 2000);
    const checksum = await getChecksum(path);
    console.dir({checksum});
    const readStream = fs.createReadStream(path);
    const payload = {
      ttl: 10,
      name: 'UPLOAD_FILE_TEST_DATA',
      checksum: checksum,
      password: '123456789',
      metadata: {},
      accessType: 'OPEN',
    };
    const form = new FormData();
    form.append('file', readStream);
    form.append('payload', JSON.stringify(payload));

    const req = http.request(
      {
        host: 'localhost',
        port: '5001',
        path: '/client/upload-file',
        method: 'POST',
        headers: form.getHeaders(),
      },
      (response) => {
        console.log(response.statusCode); // 200
      },
    );

    form.pipe(req);
  } catch (err) {
    console.log(err);
  } finally {
    await rm(path);
  }
};

test();
