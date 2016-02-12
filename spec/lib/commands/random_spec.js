import { Random } from "../../../lib/commands";

require("jasmine-before-all");

describe("Random command", () => {

  describe("is", () => {
    it("with /random@HayEquiBot", () => {
      expect(Random.is("/random@HayEquiBot")).toBe(true);
    });

    it("with /random", () => {
      expect(Random.is("/random")).toBe(true);
    });

    it("with @HayEquiBot juega", () => {
      expect(Random.is("@HayEquiBot random")).toBe(true);
    });
  });
});
