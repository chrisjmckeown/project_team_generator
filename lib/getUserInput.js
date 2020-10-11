const Manager = require("./Manager");
const Engineer = require("./Engineer");
const Intern = require("./Intern");
const inquirer = require("inquirer");
const chalk = require("chalk");
var validUrl = require("valid-url");
const employeeTypes = ["Manager", "Engineer", "Intern", "Team complete (exit)"];

function promptRepo() {
    return inquirer.prompt([
        {
            type: "list",
            message: "Please select an employee type:",
            name: "result",
            choices: [
                ...employeeTypes
            ]
        }
    ]);
}

const confirmEmailValidator = async (email) => {
    // regular expression
    valid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)

    if (valid) {
        return true;
    } else {
        console.log(chalk.red("   Please enter a valid email"));
        return false;
    }
};

const confirmURLValidator = async (input) => {
    if (validUrl.isUri(input)) {
        return true;
    } else {
        console.log(chalk.red("   Please enter a valid URL"));
        return false;
    }
};

const confirmTextValidator = async (input) => {
    if (input === "") {
        console.log(chalk.red("   Please enter a value"));
        return false;
    }
    return true;
};

function prompEmployeeInfo() {
    return inquirer.prompt([
        {
            type: "input",
            message: "Please enter user name:",
            name: "name",
            validate: confirmTextValidator
        },
        {
            type: "input",
            message: "Please enter user id:",
            name: "id",
            validate: confirmTextValidator
        },
        {
            type: "input",
            message: "Please enter user email:",
            name: "email",
            default: () => { },
            validate: confirmEmailValidator
        }
    ]);
}

function promptManagerInfo() {
    return inquirer.prompt([
        {
            type: "input",
            message: "Please enter user office number:",
            name: "officeNumber",
            validate: confirmTextValidator
        }
    ]);
}

function promptEngineerInfo() {
    return inquirer.prompt([
        {
            type: "input",
            message: "Please enter user GitHub url:",
            name: "github",
            validate: confirmURLValidator
        }
    ]);
}

function promptInternInfo() {
    return inquirer.prompt([
        {
            type: "input",
            message: "Please enter user school:",
            name: "school",
            validate: confirmTextValidator
        }
    ]);
}

async function promptTeamInfo() {
    let builtingTeam = true;
    const teamList = [];
    while (builtingTeam) {
        // use a list prompt to get input type, switch on the result until Team complete is selected.
        const { result } = await promptRepo();
        switch (result) {
            case "Team complete (exit)":
                // check the teamList has at least a manager
                const managers = teamList.filter((item) => item.getRole() === "Manager");
                if (managers.length > 0) builtingTeam = false;
                else console.log(chalk.red("Please enter at least one Manager"));
                break;
            case "Manager":
                const { name: managerName, id: managerId, email: managerEmail } = await prompEmployeeInfo()
                const { officeNumber } = await promptManagerInfo();
                const manager = new Manager(managerName, managerId, managerEmail, officeNumber);
                teamList.push(manager);
                break;
            case "Engineer":
                const { name: engineerName, id: engineerId, email: engineerEmail } = await prompEmployeeInfo()
                const { github } = await promptEngineerInfo();
                const engineer = new Engineer(engineerName, engineerId, engineerEmail, github);
                teamList.push(engineer);
                break;
            case "Intern":
                const { name: internName, id: internId, email: internEmail } = await prompEmployeeInfo()
                const { school } = await promptInternInfo();
                const intern = new Intern(internName, internId, internEmail, school);
                teamList.push(intern);
                break;
            default:
            // code block
        }
    }
    return teamList;
}

module.exports = {
    promptTeamInfo: promptTeamInfo
};