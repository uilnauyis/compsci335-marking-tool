const nodemailer = require('nodemailer');
const readXlsxFile = require('read-excel-file/node');

if (process.argv.length < 3) {
    process.abort()
}
let filePath = process.argv[2];
let upi = process.argv[3];

let transporter = nodemailer.createTransport({
    host: "localhost",
    port: 587,
    auth: {
        user: "",
        pass: ""
    }
});

const sendMails = async function (upi) {
    let rows = await readXlsxFile(filePath);
    let requirements = formatRequirements(rows);

    for (let i = 2; i < rows.length; i++) {
        // if upi is null, then send emails to all users; 
        // if upi is not null, check if this row is the targeted one.
        let row = rows[i];
        if (!upi || upi === row[3]) {
            let email = row[3] + '@aucklanduni.ac.nz';
            let marks = prepareMarks(requirements, row);


            let mailOptions = {
                from: 'COMPSCI335marking@gmail.com',
                to: email,
                subject: 'COMPSCI335 Assignment 1 marking result',
                text: `Your UPI: ${row[3]}
                
Please read the following marking for assignment #1 of COMPSCI335 and the feedback 
from your marker. 

Your mark and feedback are as follows:\n` +
                    marks
                    +
                    `\nIf you think there is an issue with your mark, please do the following:
                
1) Download a copy of your assignment submitted to ADB
2) Mark this copy (not the one you have) using the marking scheme attached herewith
3) If there is a discrepancy, request a re-mark - indicate which parts you think 
should be re-marked and what your own marks are for these parts.
                
Remark requests should be sent to COMPSCI335marking@gmail.com before 5 pm Monday 17th August. 
Requests later than this will not be considered.`};

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log(`Email sent to ${row[3]}: ${info.response}`);
                }
            });
        }
    }
}

const formatRequirements = function (rows) {
    let requirements = rows[0].slice(5, 30)

    for (let i = 0; i < requirements.length - 4; i++) {
        requirements[i] += ('(5)');
    }
    requirements[requirements.length - 4] += '(-30%)';
    requirements[requirements.length - 3] += '(-20%)';
    requirements[requirements.length - 2] += '(-100%)';
    requirements[requirements.length - 1] += '(105)';

    return requirements;
}

const prepareMarks = function (requirements, row) {
    let marks = row.slice(5, row.length);
    let res = '';
    for (let i = 0; i < requirements.length; i++) {
        res += requirements[i] + ':\n'
        if (i > requirements.length - 2 ||
            i < requirements.length - 4) {
            res += (!marks[i] ? 0 : marks[i]) + '\n'
        } else {
            res += '\n';
        }
    }
    return res;
}

sendMails(upi)