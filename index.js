#!/usr/bin/env node

const compatibility = require('./modules/compatibility');

// needs to be run on the very start of the program
compatibility.run();

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const {green} = require("chalk");
const fs = require('fs');
const touch = require("touch");

const {display, auth, localRepo, actions, requirementCheck} = require('./modules/exports');

const run = async () => {

    while (true) {
        try {

            await display.introMessage();

            await requirementCheck();

            await auth.authenticate();

            await localRepo.setup();

            await actions.processCmd();

        } catch (err) {
            if (err) {
                switch (err.status) {
                    case 401:
                        console.log(chalk.red('Couldn\'t log you in. Please provide correct credentials/token.'));
                        break;
                    case 422:
                        console.log(chalk.red('There is already a remote repository or token with the same name'));
                        break;
                    default:
                        console.log(chalk.red(err));
                }
            }
        }
    }
};

run();
