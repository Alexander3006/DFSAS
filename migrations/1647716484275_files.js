module.exports = {
  up:
    'CREATE TABLE IF NOT EXISTS `files`\n' +
    '  (\n' +
    '      `id`         INT                     NOT NULL AUTO_INCREMENT,\n' +
    '      `name`       VARCHAR(255)            NOT NULL,\n' +
    '      `hash`       VARCHAR(255)            NOT NULL,\n' +
    '      `size`       INT                     NOT NULL,\n' +
    '      `createdAt`  TIMESTAMP DEFAULT NOW() NOT NULL,\n' +
    '      PRIMARY KEY (`id`),\n' +
    '      UNIQUE KEY `files_hash` (`hash`)\n' +
    ');',
  down: 'DROP TABLE IF EXISTS `files`;',
};
