#!/usr/bin/env node

const packageDetails = require('./package.json');
var args = process.argv.slice(2);

const {
    display,
    auth,
    localRepo,
    actions,
    requirements,
    compatibility,
    errorHandling,
} = require('./modules/exports');

const run = async () => {
    //Runs the publisher until the "Quit" option has been selected

    //needs to be run on the very start of the program
    compatibility.run();

    while (true) {
        try {
            await display.introMessage();

            await requirements.check();

            await auth.authenticate();

            await localRepo.setup();

            await actions.processCmd();
        } catch (err) {
            errorHandling.process(err);
        }
    }
};
//Check for arguments
if (args == '-v') {
    console.log(packageDetails.version);
} else {
    run();
}
