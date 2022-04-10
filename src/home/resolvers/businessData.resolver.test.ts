import { createTestConf, Fixtures } from "../../shared/test.helper";

describe("Business Data test", () => {
  let fixtures: Fixtures;

  beforeEach(async () => {
    fixtures = await createTestConf();
  });


  describe("generate Business Data", () => {
    it("can generate business data", async () => {
      const businessData = await fixtures.businessDataResolver.generateBusinessDataForHome(
        "88a3eb8c-fdf3-4c70-b2c7-b33437218bf2",250000,200000,230000,200000,15000
      );
      expect(businessData.initialOfferPrice).toBe(250000);
      expect(businessData.finalOfferPrice).toBe(200000);
    });
  });



  describe("find Business Data", () => {
    it("can find business data based on home", async () => {
      const businessData = await fixtures.businessDataResolver.getBusinessDataFromHomeUuid('88a3eb8c-fdf3-4c70-b2c7-b33437218bf2');
      expect(businessData.initialOfferPrice).toBe(250000);
      expect(businessData.finalOfferPrice).toBe(200000);
    });
  });
  
});
