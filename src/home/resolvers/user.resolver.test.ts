import { createTestConf, Fixtures } from "../../shared/test.helper";

describe("home test", () => {
  let fixtures: Fixtures;

  beforeEach(async () => {
    fixtures = await createTestConf();
  });

  describe("createUser", () => {
    it("can create a user", async () => {
      const user = await fixtures.userResolver.createUser({
        firstName: "khaoula",
        email: 'alarfaouikhaoula@gmail.com',
      });
      expect(user.firstName).toBe("khaoula");
      expect(user.email).toBe("alarfaouikhaoula@gmail.com");
      expect(await fixtures.userService.getAllUsers()).toHaveLength(1);
    });
  });
  describe("getUser", () => {
    it("can get a user", async () => {
      const user = await fixtures.userResolver.getUser("bd161a77-8243-4f87-b91b-2097bd4c3e6f");
      expect(user.firstName).toBe("khaoula");
      expect(user.email).toBe("alarfaouikhaoula@gmail.com");
    });
  });
});
