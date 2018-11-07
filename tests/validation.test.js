import { isRealString } from "./../server/utils/validation";

describe("isRealString", () => {
    it("should reject non-string values", () => {
        const seed = 123;

        expect(isRealString(seed)).toBeFalsy();
    });

    it("should reject string with only space", () => {
        const seed =  "   ";

        expect(isRealString(seed)).toBeFalsy();
    });

    it("should allow string with non-space characters", () => {
        const seed = "  test  ";

        expect(isRealString(seed)).toBeTruthy();
    });
});