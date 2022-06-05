'use strict';

const {uploadFileTest} = require('./upload-file.test');
const {downloadFileTest} = require('./download-file.test');
const {deleteFileTest} = require('./delete-file.test');
const {searchFileByHashTest, searchFilesByNameTest} = require('./find-file.test');

(async () => {
  await uploadFileTest();
  await searchFileByHashTest();
  await searchFilesByNameTest();
  await downloadFileTest();
  await deleteFileTest();
})();
