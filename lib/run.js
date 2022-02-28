const {exec} = require("child_process");
const { Octokit } = require("@octokit/rest");

const {conf} = require('./conf')

let octokit = new Octokit({
    auth: conf.get('github.token')
});

module.exports = {
    processResearch: async (path, file) => {
        const compiled = file.substring(0, file.length - 3) + '.gfm.md';

        await exec(`quarto render ${file} -o=${path}/research/${compiled}`, {
            cwd: path + '/_research'
        }, async (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`Compiled research created: \n${path}/research/${compiled}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
        });
    },

    publishResearch: async (path, research) => {
        const message = `"Publishing ${research.title} #${research.number}"`;

        let allPullRequests = await octokit.rest.pulls.list({
            owner: conf.get('remoteRepoOwner'),
            repo: conf.get('remoteRepoName'),
        });

        allPullRequests = allPullRequests.data.map(pr => pr['head']['label'].split(':')[1]);

        const pullRequestExists = allPullRequests.includes(research.branch);

        const cmd = `export GITHUB_TOKEN=${conf.get('github.token')} &&` +
                    `git checkout ${research.branch} && ` +
                    `git add --all && ` +
                    `git commit -m ${message} && ` +
                    `git push origin ${research.branch}` +
                    (pullRequestExists ? `` : ` && hub pull-request `);

        //console.log(`Pull REQUEST exists : ${pullRequestExists}`);

        await exec(
                cmd,
            {
                cwd: path
            }, async (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    // TODO: print the PR link
                    // allPullRequests = await octokit.rest.pulls.list({
                    //     owner: conf.get('remoteRepo.owner'),
                    //     repo: conf.get('remoteRepo.repo'),
                    // });
                    //
                    // const pullRequest = allPullRequests.data.filter(pr => pr['head']['label'].split(':')[1] == research.branch)[0];

                    console.log(`Published research : ${research.branch}`);
                    return;
                }
                console.log(`stdout: ${stdout}`);
            });
    },

    fetchAll: async (path, research) => {
        await exec(
            `git fetch --all`,
            {
                cwd: path
            }, (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.log(`Synchronized repository`);
                }

            });
    },
};
