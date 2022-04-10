import {computeServiceFees, computeNegotiationMargin} from '../home/services/computation.service'


  it('compute Negotiation Margin', () => {
    expect(computeNegotiationMargin(150000, 130000)).toBe(0.07);
  });

  it('compute Service fees', () => {
    expect(computeServiceFees(140000, '75013')).toBe(22000);
  });
 
  it('should throw departement error',  () => {
     expect(computeServiceFees(140000, '71013')).toThrowError('Departement code is not supported')
  });

  it('should throw negative House Price ',  () => {
    expect(computeServiceFees(-140000, '75013')).toThrowError('Price cannot be negative')
 });