const {exec} = require("child_process");

module.exports = {
    processResearch: async (path, file) => {
        const compiled = file.substring(0, file.length - 3) + '.gfm.md';

        await exec(`quarto render ${file} -o=${path}/research/${compiled}`, {
            cwd: path + '/_research'
        }, (error, stdout, stderr) => {
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
        await exec(
            `git checkout ${research.branch} && ` +
            `git add --all && ` +
            `git commit -m${message} && ` +
            `git push origin ${research.branch} && ` +
            `hub pull-request `,
            {
                cwd: path
            }, (error, stdout, stderr) => {
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
