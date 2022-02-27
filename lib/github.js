const CLI = require('clui');
const Configstore = require('configstore');
const { Octokit } = require("@octokit/rest");
const Spinner = CLI.Spinner;
const {createOAuthDeviceAuth} = require("@octokit/auth-oauth-device");
const chalk = require("chalk");


const {conf} = require('./conf');

let octokit;

module.exports = {

    getStoredGithubToken: () => {
        return conf.get('github.token');
    },

    githubAuth: (token) => {
        octokit = new Octokit({
            auth: token
        });
    },

    getPersonalAccessToken: async () => {
        const status = new Spinner('Authenticating you, please wait...');

        status.start();

        const auth = createOAuthDeviceAuth({
            clientType: "oauth-app",
            clientId: "78cbea36a8129466825b",
            scopes: ['user', 'public_repo', 'repo', 'repo:status'],
            onVerification(verification) {
                console.log("\nOpen %s", verification.verification_uri);
                console.log("Enter code: %s", verification.user_code);
            },
        });

        try {
            const res = await auth({
                type: "oauth",
            });

            if (res.token) {
                conf.set('github.token', res.token);
                return res.token;
            } else {
                throw new Error("GitHub token was not found in the response");
            }
        } finally {
            status.stop();
        }
    },

    getIssues: async () => {
        const authUser = await octokit.users.getAuthenticated();

        const issues = await octokit.issues.listForRepo({
            owner: conf.get('remoteRepoOwner'),
            repo: conf.get('remoteRepoName'),
            milestone: 1, // TODO: change to 9
            assignee: authUser.data.login
        });

        let issuesArray = [];
        issues.data.forEach(issue => {
            if (issue.reactions['+1'] >= 0) // TODO: change to 2
            {
                issuesArray.push({
                    name: issue.title,
                    value: issue.number
                });
            }
        });

        if (!issuesArray.length) {
            console.log(chalk.red(`You don't have any Research proposals published or approved.\n`
            + `Please publish a research proposal first as an Issue on a Research repository.`));
            process.exit();
        }

        return [issuesArray, authUser];
    }
};
