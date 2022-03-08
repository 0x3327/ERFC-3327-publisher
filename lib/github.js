const { Spinner } = require('clui');
const { Octokit } = require('@octokit/rest');
const { createOAuthDeviceAuth } = require('@octokit/auth-oauth-device');
const chalk = require('chalk');
const { conf } = require('./conf');
const { parseRemoteRepoLink } = require('./parse');

let octokit;

module.exports = {
    getStoredGithubToken: () => {
        conf.get('github.token');
    },

    githubAuth: () => {
        octokit = new Octokit({
            auth: conf.get('github.token'),
        });
        return octokit;
    },

    getPersonalAccessToken: async () => {
        const status = new Spinner('Authenticating you, please wait...');

        status.start();

        const auth = createOAuthDeviceAuth({
            clientType: 'oauth-app',
            clientId: '78cbea36a8129466825b',
            scopes: ['user', 'public_repo', 'repo', 'repo:status'],
            onVerification(verification) {
                console.log('\nOpen %s', verification.verification_uri);
                console.log('Enter code: %s', verification.user_code);
            },
        });

        try {
            const res = await auth({
                type: 'oauth',
            });

            if (res.token) {
                conf.set('github.token', res.token);
                return res.token;
            }
            throw new Error('GitHub token was not found in the response');
        } finally {
            status.stop();
        }
    },

    getIssues: async () => {
        //Gets a list of all approved RP issues (minimum of 2 0x3327 reviewers that have '+1' reaction)

        const authUser = await octokit.users.getAuthenticated();

        const { owner, repo } = parseRemoteRepoLink(conf.get('repo.link'));

        const issues = await octokit.issues.listForRepo({
            owner,
            repo,
            milestone: conf.get('RP-issue.milestone'),
            assignee: authUser.data.login,
        });

        const issuesArray = [];

        const reactions = await Promise.all(
            issues.data.map(async (issue) =>
                octokit.request(
                    'GET /repos/{owner}/{repo}/issues/{issue_number}/reactions',
                    {
                        owner,
                        repo,
                        issue_number: issue.number,
                    }
                )
            )
        );

        issues.data.forEach((issue, idx) => {
            const validCount = reactions[idx].data
                .map((reaction) => {
                    const user = reaction.user.login;
                    const isLike = reaction.content === '+1';
                    if (isLike && conf.get('RP-issue.reviewers').includes(user))
                        return true;
                    return false;
                })
                .filter((el) => el).length;

            if (validCount >= conf.get('RP-issue.valid-reactions-count')) {
                issuesArray.push({
                    name: issue.title,
                    value: issue.number,
                });
            }
        });

        if (!issuesArray.length) {
            console.log(
                chalk.red(
                    `You don't have any Research proposals published or approved.\n` +
                        `Please publish a research proposal first as an Issue on a Research repository.`
                )
            );
            process.exit();
        }

        return [issuesArray, authUser];
    },
};
