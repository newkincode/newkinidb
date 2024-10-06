const { spawn } = require('child_process');

// Define the command and arguments
const command = 'read'; // or 'write'
const args = command === 'read' ? ['1291825305308233869'] : ['7123459875908', '3871230342523452354'];

const result = spawn('python', ['./db/database.py', command, ...args]);

// Handle standard output
result.stdout.on('data', (data) => {
    try {
        const output = JSON.parse(data); // Try parsing JSON output
        console.log(`stdout: ${JSON.stringify(output, null, 2)}`); // Pretty print JSON
    } catch (error) {
        console.error(`Failed to parse JSON output: ${data}`);
    }
});

// Handle standard error
result.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
});

// Handle process exit
result.on('close', (code) => {
    if (code === 0) {
        console.log('Child process exited successfully.');
    } else {
        console.error(`Child process exited with error code: ${code}`);
    }
});
