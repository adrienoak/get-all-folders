import glob, { IOptions } from "glob";
import { makeBasePath, Seperator } from "./helper";

type Options = Pick<IOptions, "dot">;

type Args = Options & {
  /**
   * If not defined, will default to the cwd
   */
  basePath?: string;
  seperator?: Seperator;
};

export function getAllFolders(args: Args = {}): Promise<string[]> {
  const { basePath, dot } = args;

  const path = basePath || process.cwd();

  const globPath = makeBasePath(path);

  return new Promise((resolve, rej) => {
    glob(globPath, { dot }, (_err, files) => {
      if (_err) {
        return rej(_err);
      }

      return resolve(files);
    });
  });
}

export function getAllFoldersSync(args: Args = {}): string[] {
  const { basePath, dot } = args;
  const path = basePath || process.cwd();
  const globPath = makeBasePath(path);

  const files = glob.sync(globPath, { dot });

  return files;
}
