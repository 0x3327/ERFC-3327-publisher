#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

const files = require('./lib/files');
const github = require('./lib/github');
const repo = require('./lib/repo');
const parser = require('./lib/parse');
const compile = require('./lib/run');
const {green} = require("chalk");

const inquirer = require('./lib/inquirer');


const Configstore = require('configstore');
const pkg = require('./package.json');

const conf = new Configstore(pkg.name);

const repoFolder = '/3327-research';

const fs = require('fs');
const touch = require("touch");

clear();

console.log(
    chalk.yellow(
        figlet.textSync('ERFC 3327', {horizontalLayout: 'full'})
    ),
);

console.log(
    green('Publishing tool for 3327 research repository.')
)


const getGithubToken = async () => {
    // Fetch token from config store
    let token = github.getStoredGithubToken();
    if (token) {
        return token;
    }

    console.log(chalk.red('Please connect your GitHub account first'));

    // No token found, use credentials to access GitHub account
    console.log(green('Connecting your GitHub account'));
    token = await github.getPersonalAccessToken();

    return token;
};

const run = async () => {
    try {
        // Retrieve & Set Authentication Token
        const token = await getGithubToken();
        github.githubAuth(token);

        // Check if repo is already configured
        if (!conf.get('repo.installed')) {
            console.log(chalk.red('3327 Research repository not set yet. Please set it up first.'));
            const pathAnswers = await inquirer.getPathForRepo(process.cwd());
            try {
                await repo.cloneRepo(pathAnswers.repoPath, repoFolder);
            } catch (e) {
                console.log(chalk.red(e.message));
            }

            console.log(green('Repository cloned at ' + pathAnswers.repoPath + repoFolder));
            conf.set('repo.installed', true);
            conf.set('repo.path', pathAnswers.repoPath + repoFolder);
            conf.set('my-research', []);
        }

        const repoPath = conf.get('repo.path');

        //Check if directory really exists
        if (!files.directoryExists(repoPath)) {
            await repo.cloneRepo(repoPath);
            console.log(green('Repository cloned at ' + repoPath));
        }

        const answers = await inquirer.askWhatToDo();
        await repo.pullRepo(repoPath)

        //Setup a new research
        if (answers.action === 'setupnew') {
            const [issues, authUser] = await github.getIssues();
            const issueAnswer = await inquirer.selectResearchProposal(issues);
            const issue = issues.find(o => o.value === issueAnswer.proposal);
            const [branch, researchName]
                = await repo.setupNewBranch(repoPath, issue);

            console.log(chalk.yellow(`Switching to new branch ${branch}`));


            // creating assets directory
            try {
                fs.mkdirSync(repoPath + `/assets/ERFC-${issue.value}`);
                touch(repoPath + `/assets/ERFC-${issue.value}/.gitignore`);
            } catch (e) {
                // we already have a directory
            } finally {
                console.log(chalk.yellow('Created assets directory'));
            }

            // creating template file
            fs.copyFileSync(repoPath + '/ERFC-research-template.md'
                , repoPath + '/_research/' + `ERFC-${issue.value}.md`)
            console.log(chalk.green('Research template set:'));
            console.log(chalk.cyan(repoPath + '/_research/' + `ERFC-${issue.value}.md`));

            await parser
                .parseResearchTemplate(
                    repoPath + `/_research/ERFC-${issue.value}.md`,
                    researchName,
                    authUser.data.name,
                    issue.value
                );

            console.log(chalk.green('Research assets folder created:'));
            console.log(chalk.cyan(repoPath + `/assets/ERFC-${issue.value}`));
            const research = {
                name: `ERFC-${issue.value}`,
                number: issue.value,
                title: researchName,
                branch
            };

            //check if research is already in the storage, if not, add it
            if (!conf.get('my-research').filter(
                single => single['number'] === research.number
            ).length) {
                conf.set('my-research', [...conf.get('my-research'), research]);
            }

            console.log(chalk.green('All done. Happy writing!'));
        }

        //Compile a research
        if (answers.action === 'compileresearch') {
            const answer = await inquirer.selectResearch(conf.get('my-research'));
            await repo.checkoutBranch(repoPath, answer.research.branch);
            await compile.processResearch(`${repoPath}`, `${answer.research.name}.md`)
        }

        //Publishing research
        if (answers.action === 'publishresearch') {
            const answer = await inquirer.selectResearch(conf.get('my-research'));
            await compile.publishResearch(repoPath, answer.research)
            console.log(green('Published research as pull request. All done!'));
        }

        //Synchronize repo
        if (answers.action === 'syncrepo') {
            await compile.fetchAll(repoPath);
            console.log(green('Synchronised repository. All done!'));
        }

        //Presentations
        //TODO: Implement presentations when presentation template is ready
        if(answers.action === 'createpresentation' || answers.action === 'compilepresentation') {
            console.log(chalk.red('Presentations are not yet implemented'))
        }


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
};

run();
