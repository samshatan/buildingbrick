import crypto from 'crypto';
import { generateSignature } from '../controllers/paymentController.js';

describe('Payment Controller Tests', () => {

  describe('generateSignature', () => {
    it('should correctly generate X-VERIFY signature against a known baseline', () => {
      // It's using the fallback default variables, as paymentController module scope is evaluated
      // BEFORE process.env can be overriden in jest tests, unless we use jest.mock/resetModules
      // However since it's hardcoded fallback values, we can just use those default fallback values
      // as our baseline for determinism.
      const defaultSaltKey = '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399';
      const defaultSaltIndex = '1';

      const payloadString = '{"test":"data"}';
      const endpoint = "/pg/v1/pay";

      const actualSignature = generateSignature(payloadString, endpoint);

      // Known baseline using hardcoded fallbacks: sha256('{"test":"data"}/pg/v1/pay099eb0cd-02cf-4e2a-8aca-3e6c6aff0399') + '###1'
      const expectedDataToHash = payloadString + endpoint + defaultSaltKey;
      const expectedHash = crypto.createHash('sha256').update(expectedDataToHash).digest('hex');
      const expectedSignature = expectedHash + '###' + defaultSaltIndex;

      expect(actualSignature).toBe(expectedSignature);
      // Even better, test against the literal expected output so it's not tautological
      // The hash string of '{"test":"data"}/pg/v1/pay099eb0cd-02cf-4e2a-8aca-3e6c6aff0399' is ae7cb66a296efe55c5cdfbfec31447a77227ce3e3964b0f64045babe8210a48d
      expect(actualSignature).toBe('ae7cb66a296efe55c5cdfbfec31447a77227ce3e3964b0f64045babe8210a48d###1');
    });

    it('should generate consistent signatures for identical inputs', () => {
      const payloadString = "some-payload";
      const endpoint = "/api/v1/endpoint";

      const signature1 = generateSignature(payloadString, endpoint);
      const signature2 = generateSignature(payloadString, endpoint);

      expect(signature1).toBe(signature2);
    });

    it('should generate different signatures for different payloads', () => {
      const payload1 = "payload1";
      const payload2 = "payload2";
      const endpoint = "/api/v1/endpoint";

      const signature1 = generateSignature(payload1, endpoint);
      const signature2 = generateSignature(payload2, endpoint);

      expect(signature1).not.toBe(signature2);
    });

    it('should generate different signatures for different endpoints', () => {
      const payload = "payload";
      const endpoint1 = "/api/v1/endpoint1";
      const endpoint2 = "/api/v1/endpoint2";

      const signature1 = generateSignature(payload, endpoint1);
      const signature2 = generateSignature(payload, endpoint2);

      expect(signature1).not.toBe(signature2);
    });
  });
});
