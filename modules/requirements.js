const { exec } = require('child_process');
const chalk = require('chalk');
const { utils } = require('../lib/exports');

const quartoRequirement = async () => {
    //Checks if Quarto is installed

    await exec('quarto --version', {}, (error) => {
        const notInstalled =
            error != null
                ? error.toString().includes('command not found')
                : false;

        if (notInstalled) {
            console.log(
                chalk.red(
                    `Quarto not installed ! - Without it you cannot compile your research`
                )
            );
            console.log(
                `Install it by following the : https://quarto.org/docs/get-started/`
            );
        }
    });
};

const hubRequirement = async () => {
    //Checks if Hub is installed

    await exec('hub --version', {}, (error) => {
        const notInstalled =
            error != null
                ? error.toString().includes('command not found')
                : false;

        if (notInstalled) {
            console.log(
                chalk.red(
                    `Hub not installed ! - Without it you cannot publish your research`
                )
            );
            console.log(
                `Install it by following the : https://hub.github.com/`
            );
        }
    });
};

const check = async () => {
    //Checks if all of the publisher's requirements are installed

    await quartoRequirement();

    await hubRequirement();

    await utils.delay(50);
};

module.exports = { check };
