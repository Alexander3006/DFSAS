'use strict';

const {uploadFileTest} = require('./upload-file.test');
const {downloadFileTest} = require('./download-file.test');
const {deleteFileTest} = require('./delete-file.test');
const {searchFileByHashTest, searchFileByNameTest} = require('./find-file.test');

(async () => {
  await uploadFileTest();
  await searchFileByHashTest();
  await searchFileByNameTest();
  await downloadFileTest();
  await deleteFileTest();
})();
