import conventionalChangelogPreset from 'conventional-changelog-conventionalcommits';
import conventionalChangelogCore from 'conventional-changelog-core';

/**
 * @type {import('conventional-changelog-core').Options}
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
 * @param {string} version
 * @param {boolean} onTag
 * @returns
 */
export function getChangelog(version, onTag) {
  return conventionalChangelogCore(
    {
      config,
      releaseCount: onTag ? 2 : 1,
    },
    { version, linkCompare: false },
    undefined,
    undefined,
    { headerPartial: '' },
  );
}
