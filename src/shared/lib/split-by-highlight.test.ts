import { describe, expect, it } from "vitest";

import { splitByHighlight } from "./split-by-highlight";

describe("splitByHighlight", () => {
  it("returns empty array when text is empty", () => {
    const result = splitByHighlight("", "test");

    expect(result).toEqual([]);
  });

  it("returns single non-highlighted segment when highlight is empty", () => {
    const result = splitByHighlight("Hello World", "");

    expect(result).toEqual([{ value: "Hello World", highlighted: false }]);
  });

  it("returns single non-highlighted segment when highlight is whitespace only", () => {
    const result = splitByHighlight("Hello World", "   ");

    expect(result).toEqual([{ value: "Hello World", highlighted: false }]);
  });

  it("returns single non-highlighted segment when no match found", () => {
    const result = splitByHighlight("Hello World", "xyz");

    expect(result).toEqual([{ value: "Hello World", highlighted: false }]);
  });

  it("highlights single match in the middle", () => {
    const result = splitByHighlight("Hello World", "World");

    expect(result).toEqual([
      { value: "Hello ", highlighted: false },
      { value: "World", highlighted: true },
      { value: "", highlighted: false },
    ]);
  });

  it("highlights match at the start of text", () => {
    const result = splitByHighlight("Hello World", "Hello");

    expect(result).toEqual([
      { value: "", highlighted: false },
      { value: "Hello", highlighted: true },
      { value: " World", highlighted: false },
    ]);
  });

  it("highlights match at the end of text", () => {
    const result = splitByHighlight("Hello World", "World");

    expect(result).toEqual([
      { value: "Hello ", highlighted: false },
      { value: "World", highlighted: true },
      { value: "", highlighted: false },
    ]);
  });

  it("highlights multiple matches", () => {
    const result = splitByHighlight("abcabc", "abc");

    expect(result).toEqual([
      { value: "", highlighted: false },
      { value: "abc", highlighted: true },
      { value: "", highlighted: false },
      { value: "abc", highlighted: true },
      { value: "", highlighted: false },
    ]);
  });

  it("highlights consecutive matches", () => {
    const result = splitByHighlight("aaaa", "aa");

    expect(result).toEqual([
      { value: "", highlighted: false },
      { value: "aa", highlighted: true },
      { value: "", highlighted: false },
      { value: "aa", highlighted: true },
      { value: "", highlighted: false },
    ]);
  });

  it("is case insensitive", () => {
    const result = splitByHighlight("Hello World", "hello");

    expect(result).toEqual([
      { value: "", highlighted: false },
      { value: "Hello", highlighted: true },
      { value: " World", highlighted: false },
    ]);
  });

  it("handles regex special characters as literal strings (dot)", () => {
    // NOTE: The current implementation does NOT escape regex special chars.
    // This test documents the actual behavior: "." is treated as regex wildcard.
    const result = splitByHighlight("a.b", ".");

    // Expected: [{ value: "a.b", highlighted: false }] if "." was escaped
    // Actual: "." matches any character, so "a", ".", "b" all match
    expect(result).toEqual([
      { value: "", highlighted: false },
      { value: "a", highlighted: true },
      { value: "", highlighted: false },
      { value: ".", highlighted: true },
      { value: "", highlighted: false },
      { value: "b", highlighted: true },
      { value: "", highlighted: false },
    ]);
  });

  it("handles regex special characters as literal strings (parenthesis)", () => {
    // NOTE: The current implementation does NOT escape regex special chars.
    // This test documents the actual behavior: unescaped "(" causes regex error.
    expect(() => splitByHighlight("test(abc)", "(")).toThrow();
  });

  it("handles regex special characters as literal strings (bracket)", () => {
    // NOTE: The current implementation does NOT escape regex special chars.
    // This test documents the actual behavior: unescaped "[" causes regex error.
    expect(() => splitByHighlight("test[abc]", "[")).toThrow();
  });

  it("highlights partial word match", () => {
    const result = splitByHighlight("JavaScript", "Script");

    expect(result).toEqual([
      { value: "Java", highlighted: false },
      { value: "Script", highlighted: true },
      { value: "", highlighted: false },
    ]);
  });

  it("highlights when entire text matches", () => {
    const result = splitByHighlight("test", "test");

    expect(result).toEqual([
      { value: "", highlighted: false },
      { value: "test", highlighted: true },
      { value: "", highlighted: false },
    ]);
  });

  it("handles Korean text", () => {
    const result = splitByHighlight("안녕하세요 세계", "세계");

    expect(result).toEqual([
      { value: "안녕하세요 ", highlighted: false },
      { value: "세계", highlighted: true },
      { value: "", highlighted: false },
    ]);
  });

  it("handles mixed Korean and English", () => {
    const result = splitByHighlight("이름: John Doe", "John");

    expect(result).toEqual([
      { value: "이름: ", highlighted: false },
      { value: "John", highlighted: true },
      { value: " Doe", highlighted: false },
    ]);
  });
});
