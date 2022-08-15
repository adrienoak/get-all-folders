import mockFS from "mock-fs";
import { type DirectoryItems } from "mock-fs/lib/filesystem";
import { afterEach, describe, expect, it } from "vitest";
import { getAllFolders, getAllFoldersSync } from "./main";

const mock: DirectoryItems = {
  [`${process.cwd()}`]: {
    testing: {
      voila: {
        yo: {
          foo: {
            bar: "baz",
            val: "random",
          },
        },
      },
    },
    ".git": {
      HEAD: "true",
    },
  },
};

function loopThroughMock(object: DirectoryItems = {}, dot = false): number {
  const hasCwdMocked = object[`${process.cwd()}`];

  const startingValue = hasCwdMocked ? 0 : 1;
  return Object.entries(object).reduce((acc, [key, value]) => {
    if (key[0] === "." && !dot) {
      return acc;
    }
    if (value instanceof Object) {
      return acc + loopThroughMock(value as DirectoryItems, dot);
    }

    if (typeof value === "string") {
      return acc;
    }

    return acc + 1;
  }, startingValue);
}

describe(`Async `, () => {
  afterEach(() => {
    mockFS.restore();
  });

  it("works?", async () => {
    mockFS(mock, {
      createCwd: false,
    });

    const data = await getAllFolders({ basePath: `${process.cwd()}/**/` });
    expect(data).toHaveLength(loopThroughMock(mock));
  });

  it("works with dot", async () => {
    mockFS(mock, {
      createCwd: false,
    });
    const withoutDot = loopThroughMock(mock);
    const withDot = loopThroughMock(mock, true);
    const data = await getAllFolders({ dot: true });

    expect(withDot).toBeGreaterThan(withoutDot);
    expect(data).toHaveLength(withDot);
  });
});

describe(`Sync `, () => {
  afterEach(() => {
    mockFS.restore();
  });

  it("works?", () => {
    mockFS(mock, {
      createCwd: false,
    });

    const data = getAllFoldersSync({ basePath: `${process.cwd()}/**/` });
    expect(data).toHaveLength(loopThroughMock(mock));
  });

  it("works with dot", () => {
    mockFS(mock, {
      createCwd: false,
    });
    const withoutDot = loopThroughMock(mock);
    const withDot = loopThroughMock(mock, true);
    const data = getAllFoldersSync({ dot: true });

    expect(withDot).toBeGreaterThan(withoutDot);
    expect(data).toHaveLength(withDot);
  });
});
