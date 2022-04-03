module.exports = {
  up:
    'CREATE TABLE IF NOT EXISTS `owners`\n' +
    '(\n' +
    '    `id`         INT          NOT NULL AUTO_INCREMENT,\n' +
    '    `ttl`        INT          NOT NULL,\n' +
    '    `accessType` VARCHAR(255) NOT NULL,\n' +
    '    `address`   VARCHAR(255) NOT NULL,\n' +
    '    `metadata`   JSON,\n' +
    '    `fileId`     INT,\n' +
    '    `createdAt`  TIMESTAMP DEFAULT NOW() NOT NULL,\n' +
    '    PRIMARY KEY (`id`),\n' +
    '    FOREIGN KEY (`fileId`) REFERENCES `files` (`id`),\n' +
    '    UNIQUE KEY `owners_address_fileId` (`address`, `fileId`)' +
    ');',
  down: 'DROP TABLE IF EXISTS `owners`;',
};
