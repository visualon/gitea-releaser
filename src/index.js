import { Command, runExit } from 'clipanion';
import { getChangelog } from './changelog/util.js';

class GiteaReleaseCommand extends Command {
  async execute() {
    const url = new URL(process.env.GIT_URL);
    const api = `${url.origin}/api/v1`;
    const repo = url.pathname.replace(/\.git$/, '').replace(/^\//, '');
    const token = process.env.GITEA_TOKEN;
    const tag = process.env.TAG_NAME;

    this.context.stdout.write(`Using api: ${api}.\n`);
    this.context.stdout.write(`Using repository: ${repo}\n`);

    if (!token) {
      this.context.stdout.write('GITEA_TOKEN environment variable not set.\n');
      return 1;
    }

    if (tag) {
      this.context.stdout.write(`Using tag: ${tag}\n`);
    } else {
      this.context.stdout.write('No tag found for this commit. Please tag the commit and try again.\n');
      return 1;
    }

    this.context.stdout.write(`Checking remote tag ${tag}.\n`);
    let resp = await fetch(`${api}/repos/${repo}/tags/${tag}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!resp.ok) {
      this.context.stdout.write(`Tag ${tag} not found on remote.\n`);
      return 1;
    }

    this.context.stdout.write(`Checking remote release ${tag}.\n`);
    resp = await fetch(`${api}/repos/${repo}/releases/tags/${tag}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (resp.ok) {
      this.context.stdout.write(`Release ${tag} already exists.\n`);
      return 1;
    } else if (resp.status !== 404) {
      this.context.stdout.write(`Error checking for release ${tag}.\n${resp.status}: ${resp.statusText}\n`);
      return 1;
    }

    const changes = await getChangelog(true);

    this.context.stdout.write(`Creating release ${tag}.\n`);
    resp = await fetch(`${api}/repos/${repo}/releases`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        draft: false,
        prerelease: tag.includes('-'),
        tag_name: tag,
        name: tag.replace(/^v/, ''),
        body: changes,
        target_commitish: 'main',
      }),
    });

    if (!resp.ok) {
      this.context.stdout.write(`Error creating release ${tag}.\n${resp.status}: ${resp.statusText}\n`);
      return 1;
    }
  }
}

void runExit(GiteaReleaseCommand);
