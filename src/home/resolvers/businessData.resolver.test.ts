import { createTestConf, Fixtures } from "../../shared/test.helper";

describe("Business Data test", () => {
  let fixtures: Fixtures;

  beforeEach(async () => {
    fixtures = await createTestConf();
  });

  describe("find Business Data", () => {
    it("can find business data based on home", async () => {
      const businessData = await fixtures.businessDataResolver.getBusinessDataFromHomeUuid('');
      expect(businessData.finalOfferPrice).toBe(200000);
      expect(businessData.initialOfferPrice).toBe(170000);
      expect(businessData.targetSalePrice).toBe(180000);
      expect(businessData.serviceFees).toBe(13000);
      expect(businessData.negociationMargin).toBe(3000);
    });
  });
  
});
