const request = require('request');
const fs = require('fs-extra');
const isValidPath = require('is-valid-path');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const URL = process.argv[2];

let PATH = process.argv[3];

const writeFile = function(body) {
  fs.writeFile(PATH, body, err => {
    //if PATH is incorrect, throws error saying so.
    if (err) throw err;

    //if no error, write to the file and print out below.
    let stats = fs.statSync(PATH);
    console.log(`Downloaded and saved ${stats.size} bytes to ${PATH}`);
    process.exit();
  });
};

request(URL, (error, response, body) => {
  if (error) throw error;

  //If response.statusCode is anything but 200 terminate program.
  if (!response || response.statusCode !== 200) {
    console.log('Bad response in request.');
    console.log(`statusCode: ${response.statusCode}`);
    process.exit();
  }

  //check if the Path/file already exists. If yes, prompt to overwrite.
  if (fs.existsSync(PATH)) {
    rl.question(
      'The file you are writing to already exist. push Y to overwrite.\n',
      answer => {
        if (answer === 'Y' || answer === 'y') {
          writeFile(body);
        }
        rl.close();
        // process.exit();
      }
    );
  } else {
    writeFile(body);
    // process.exit();
  }
  // process.exit();
});

// stats = fs.statSync(body)
// console.log(`Downloaded and saved ${stats.size} to ${PATH}`);

// fs.writeFile(PATH, response, function(err) {
//   if(err) {
//       return console.log(err);
//   }
//   console.log("The file was saved!");
// });
