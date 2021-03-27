import { expect } from 'chai';
import { calcMonthlyPaymentAmount } from '../math';

describe('math', () => {

  describe('calcMonthlyPaymentAmount', () => {
    it('should calculate', () => {
      const out = calcMonthlyPaymentAmount(10000, 0.05, 60);
      expect(out).to.equal(12345);
    });
  })

});
