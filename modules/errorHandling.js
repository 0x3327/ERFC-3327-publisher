const chalk = require('chalk');

const process = (err) => {
    //Process an error if it has occured

    if (err) {
        switch (err.status) {
            case 401:
                console.log(
                    chalk.red(
                        "Couldn't log you in. Please provide correct credentials/token."
                    )
                );
                break;
            case 422:
                console.log(
                    chalk.red(
                        'There is already a remote repository or token with the same name'
                    )
                );
                break;
            default:
                console.log(chalk.red(err));
        }
    }
};

module.exports = { process };
