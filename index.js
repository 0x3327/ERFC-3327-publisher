#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const {green} = require("chalk");
const fs = require('fs');
const touch = require("touch");

const {display, auth, localRepo, actions} = require('./modules/exports');

const run = async () => {

    while (true) {
        try {

            display.introMessage();

            await auth.authenticate();

            await localRepo.setup();

            const {quitSelected} = await actions.processCmd();

            if (quitSelected) break;

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
