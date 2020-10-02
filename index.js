const client = require('@sendgrid/mail');
const readXlsxFile = require('read-excel-file/node');
require('dotenv').config();
client.setApiKey(process.env.SENDGRID_API_KEY);
const ASSIGNMENT_NAME = 'Assignment 4';

if (process.argv.length < 3) {
    process.abort()
}
let filePath = process.argv[2];
let upi = process.argv[3];

const sendMails = async function (upi) {
    let rows = await readXlsxFile(filePath);
    let requirements = formatRequirements(rows);

    for (let i = 2; i < rows.length; i++) {
        // if upi is null, then send emails to all users; 
        // if upi is not null, check if this row is the targeted one.
        let row = rows[i];
        if (!upi || upi === row[2]) {
            let email = row[2] + '@aucklanduni.ac.nz';
            let marks = prepareMarks(requirements, row);


            let mailOptions = {
                from: 'COMPSCI335marking@gmail.com',
                to: email,
                subject: `COMPSCI335 ${ASSIGNMENT_NAME} marking result`,
                text: `Your UPI: ${row[2]}
                
Please read the following marking for ${ASSIGNMENT_NAME} of COMPSCI335 and the feedback 
from your marker. 

Your mark and feedback are as follows:\n` +
                    marks
                    +

                    `\nIf you think there is an issue with your mark, please do the following:
                
1) Download a copy of your assignment submitted to ADB
2) Mark this copy (not the one you have) using the marking scheme attached herewith
3) If there is a discrepancy, request a re-mark - indicate which parts you think 
should be re-marked and what your own marks are for these parts.
                
Remark requests should be sent to COMPSCI335marking@gmail.com before Friday 18th September. 
Requests later than this will not be considered.`};



            client.send(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log(`Email sent to ${row[2]}: ${info.response}`);
                }
            });
            await sleep(1000);
        }
    }
}

const formatRequirements = function (rows) {
    let requirements = rows[0].slice(3);
    let requirementsMarks = rows[1].slice(3);
    for (let i = 0; i < requirements.length; i++) {
        requirements[i] += requirementsMarks[i] ? `(${requirementsMarks[i]})` : '';
    }
    return requirements;
}

const prepareMarks = function (requirements, row) {
    let marks = row.slice(3, row.length);
    let res = '';
    for (let i = 0; i < requirements.length; i++) {
        res += requirements[i] + ':\n'
        res += marks[i] !== null ? marks[i] + '\n' : '\n';
    }
    return res;
}

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }   

sendMails(upi)