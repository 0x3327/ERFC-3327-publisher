const {spawn, exec} = require('child_process');
const chalk = require("chalk");

const quartoRequirement = async () => {

    await exec('quarto --version', {}, (error, stdout, stderr) => {

        const notInstalled = error != null ? error.toString().includes('command not found') : false;

        if (notInstalled) {
            console.log(
                chalk.red(`Quarto not installed ! - Without it you cannot compile your research`)
            );
            console.log(`Install it by following the : https://quarto.org/docs/get-started/`)
        }
    });

}

const hubRequirement = async () => {

    await exec('hub --version', {}, (error, stdout, stderr) => {

        const notInstalled = error != null ? error.toString().includes('command not found') : false;

        if (notInstalled) {
            console.log(
                chalk.red(`Hub not installed ! - Without it you cannot publish your research`)
            );
            console.log(`Install it by following the : https://hub.github.com/`)
        }
    });

}


const requirementCheck = async () => {

    await quartoRequirement();

    await hubRequirement();

    await new Promise(function(resolve){ setTimeout(resolve, 2000);});

}


module.exports = { requirementCheck };
