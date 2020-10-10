const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const util = require('util');
const writeFileAsync = util.promisify(fs.writeFile);

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

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

function prompEmployeeInfo() {
    return inquirer.prompt([
        {
            type: "input",
            message: "Please enter user name:",
            name: "name"
        },
        {
            type: "input",
            message: "Please enter user id:",
            name: "id"
        },
        {
            type: "input",
            message: "Please enter user email:",
            name: "email"
        }
    ]);
}

function promptManagerInfo() {
    return inquirer.prompt([
        {
            type: "input",
            message: "Please enter user office number:",
            name: "officeNumber"
        }
    ]);
}

function promptEngineerInfo() {
    return inquirer.prompt([
        {
            type: "input",
            message: "Please enter user GitHub url:",
            name: "github"
        }
    ]);
}

function promptInternInfo() {
    return inquirer.prompt([
        {
            type: "input",
            message: "Please enter user school:",
            name: "school"
        }
    ]);
}

function folderExists(outputPath) {
    try {
        return fs.lstatSync(outputPath).isDirectory();
    } catch (_) {
        return false;
    }
}

async function promptTeamInfo() {
    let builtingTeam = true;
    const employeeList = [];
    while (builtingTeam) {
        const { result } = await promptRepo();
        switch (result) {
            case "Team complete (exit)":
                builtingTeam = false;
                break;
            case "Manager":
                var { name, id, email } = await prompEmployeeInfo()
                let { officeNumber } = await promptManagerInfo();
                const manager = new Manager(name, id, email, officeNumber);
                employeeList.push(manager);
                break;
            case "Engineer":
                var { name, id, email } = await prompEmployeeInfo()
                let { github } = await promptEngineerInfo();
                const engineer = new Engineer(name, id, email, github);
                employeeList.push(engineer);
                break;
            case "Intern":
                var { name, id, email } = await prompEmployeeInfo()
                let { school } = await promptInternInfo();
                const intern = new Intern(name, id, email, school);
                employeeList.push(intern);
                break;
            default:
            // code block
        }
    }
    const html = render(employeeList);
  //  console.log(html);
    
    await writeFileAsync(outputPath, html, "utf8");
    console.log(`Successfully generated the team file. \nSee here: ${outputPath}`);
}

promptTeamInfo();

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
