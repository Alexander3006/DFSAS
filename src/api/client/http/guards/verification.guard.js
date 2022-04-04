'use strict';

const {SignatureDTO} = require('../../../services/dto/signature.dto');

const verifivationGuard = async (container, signature, address) => {
  const {verificationService} = container;
  if (!(signature instanceof SignatureDTO))
    throw new Error('Signature not instanceof SignatureDTO');
  try {
    const verifiedAddress = await verificationService.verify(signature);
    if (!verified) throw new Error('Not verified');
    if (address !== verifiedAddress) throw new Error('Address not verified');
    return address;
  } catch (err) {
    console.log(err);
    throw new Error('Verify guard error');
  }
};

module.exports = {
  verifivationGuard,
};
