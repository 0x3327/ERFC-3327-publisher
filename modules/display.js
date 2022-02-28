#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const {green} = require("chalk");
const fs = require('fs');
const touch = require("touch");

const {conf} = require('../lib/exports');

module.exports = {

    introMessage: async () => {

        clear();

        console.log(
            chalk.yellow(
                figlet.textSync('ERFC 3327', {horizontalLayout: 'full'})
            ),
        );

        console.log(
            green('Publishing tool for 3327 research repository.')
        )

    }

};
