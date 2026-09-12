import { describe, it, expect } from "vitest";
import { cn, formatPermissionName, formatName } from "../utils";

// Replaces the create-react-app stub test (which asserted on "learn react" and
// had never been runnable — the CRA test script was misconfigured and
// @testing-library was never installed). These cover the helpers that survived
// the Vite migration, including the `cn` signature that lost its TypeScript
// annotations when utils.js stopped being parsed as Flow.
describe("cn", () => {
    it("joins class names", () => {
        expect(cn("a", "b")).toBe("a b");
    });

    it("drops falsy values", () => {
        expect(cn("a", false && "b", null, undefined, "c")).toBe("a c");
    });

    it("lets a later tailwind class win over an earlier conflicting one", () => {
        expect(cn("p-2", "p-4")).toBe("p-4");
    });

    it("accepts arrays and conditional objects", () => {
        expect(cn(["a", "b"], { c: true, d: false })).toBe("a b c");
    });
});

describe("formatPermissionName", () => {
    it("turns a snake_case permission into a title", () => {
        expect(formatPermissionName("view_dashboard")).toBe("View Dashboard");
    });

    it("capitalises a single word", () => {
        expect(formatPermissionName("reports")).toBe("Reports");
    });
});

describe("formatName", () => {
    it("formats the same way as formatPermissionName", () => {
        expect(formatName("data_breach_report")).toBe("Data Breach Report");
    });
});
