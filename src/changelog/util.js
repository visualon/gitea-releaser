import conventionalChangelogPreset from 'conventional-changelog-conventionalcommits';
import { ConventionalChangelog } from 'conventional-changelog';

/**
 * @type {import('conventional-changelog').Preset}
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
export const config = conventionalChangelogPreset({
  types: [
    {
      type: 'feat',
      section: 'Features',
    },
    {
      type: 'fix',
      section: 'Bug Fixes',
    },
    {
      type: 'perf',
      section: 'Performance Improvements',
    },
    {
      type: 'revert',
      section: 'Reverts',
    },
    {
      type: 'docs',
      section: 'Documentation',
    },
    {
      type: 'style',
      section: 'Styles',
    },
    {
      type: 'refactor',
      section: 'Code Refactoring',
    },
    {
      type: 'test',
      section: 'Tests',
    },
    {
      type: 'build',
      section: 'Build System',
    },
    {
      type: 'ci',
      section: 'Continuous Integration',
    },
    {
      type: 'chore',
      section: 'Miscellaneous Chores',
    },
  ],
});

/**
 *
 * @param {boolean|undefined} onTag
 * @returns
 */
export async function getChangelog(onTag = false) {
  const generator = new ConventionalChangelog()
    .readPackage()
    .config(config)
    .writer({ headerPartial: '' })
    .options({ releaseCount: onTag ? 2 : 1 });

  // generator.options({
  //   debug(namespace, payload) {
  //     console.info(`[${namespace}]:`, payload);
  //   },
  //   warn(namespace, payload) {
  //     console.warn(`[${namespace}]:`, payload);
  //   },
  // });

  /** @type {string[]} */
  const lines = [];

  for await (const line of generator.write()) {
    lines.push(line);
  }

  return lines.join('');
}
