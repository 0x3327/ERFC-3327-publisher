const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

module.exports = {
    introMessage: async () => {
        //Displays the publisher's intro message

        clear();

        console.log(
            chalk.yellow(
                figlet.textSync('ERFC 3327', { horizontalLayout: 'full' })
            )
        );

        console.log(
            chalk.green('Publishing tool for 3327 research repository.')
        );
    },
};
