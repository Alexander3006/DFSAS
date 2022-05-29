const fs = require('fs');
const crypto = require('crypto');

const generateLargeFile = async (path, seed, iterations = 10000) => {
  const writebleFileStream = fs.createWriteStream(path, 'utf-8');
  for (let i = 0; i < iterations; i++) {
    await new Promise((res, rej) => {
      writebleFileStream.write(seed, (err) => {
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

module.exports = {
  rm,
  generateLargeFile,
  getChecksum,
};
