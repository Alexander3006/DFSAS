'use strict';

const {EndpointMethods} = require('../../../infrastructure/transport/interfaces/constants');
const {HttpEndpoint} = require('../../../infrastructure/transport/router/http.endpoint');

const getTempNonce = async (container, {connection, context}) => {
  const {verificationService, signatureService} = container;
  try {
    const payload = JSON.parse(await connection.payload());
    const {
      data: {publicKey},
    } = payload;
    const address = signatureService.publicKeyToAddress(publicKey);
    const nonce = await verificationService.generateNonce({address});
    await connection.send(
      JSON.stringify({
        success: true,
        result: {nonce},
      }),
    );
    return;
  } catch (err) {
    console.log(err);
    await connection.send(
      JSON.stringify({
        success: false,
        message: err?.message ?? '',
      }),
    );
  }
};

module.exports = (container) =>
  new HttpEndpoint({
    method: EndpointMethods.POST,
    path: '/client/get-temp-nonce',
    handler: getTempNonce.bind(null, container),
  });
