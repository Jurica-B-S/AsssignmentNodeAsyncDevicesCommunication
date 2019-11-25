const { randomNumber, AsciiToHex } = require("../helper_functions/functions");

describe("Checking random number function", () => {
  test("Check for 1,5", () => {
    let x = randomNumber(1, 5);
    expect(x).toBeGreaterThanOrEqual(1);
    expect(x).toBeLessThanOrEqual(5);
  });
  test("Check for -1,5", () => {
    let x = randomNumber(-1, 5);
    expect(x).toEqual(null);
  });
  test("Check for 1,", () => {
    let x = randomNumber(1);
    expect(x).toEqual(null);
  });
  test("Check for string,", () => {
    let x = randomNumber("string", 3);
    expect(x).toEqual(null);
  });
  test("Check for boolean,", () => {
    let x = randomNumber(true, 3);
    expect(x).toEqual(null);
  });
  test("Check for min>=max", () => {
    let x = randomNumber(5, 3);
    expect(x).toEqual(null);
  });
});

describe("Checking AsciiToHex", () => {
  test("Check for 'A' ", () => {
    let x = AsciiToHex("A");
    expect(x).toEqual("0x41");
  });
  test("Check for 'B' ", () => {
    let x = AsciiToHex("B");
    expect(x).toEqual("0x42");
  });
  test("Check for '\n' ", () => {
    let x = AsciiToHex("\n");
    expect(x).toEqual("0x0a");
  });
  test("Check for integer 10 ", () => {
    let x = AsciiToHex(10);
    expect(x).toEqual(null);
  });
  test("Check for boolean true ", () => {
    let x = AsciiToHex(true);
    expect(x).toEqual(null);
  });
  test("Check for string longer than 2 chars ", () => {
    let x = AsciiToHex("bla");
    expect(x).toEqual(null);
  });
});
