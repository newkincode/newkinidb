const { spawn } = require('child_process');

// Function to read from the database
function readDB(serverId) {
    return new Promise((resolve, reject) => {
        const result = spawn('python', ['./db/database.py', 'read', serverId]);

        // Handle standard output
        result.stdout.on('data', (data) => {
            try {
                const output = JSON.parse(data); // Try parsing JSON output
                console.log(`stdout: ${JSON.stringify(output, null, 2)}`); // Pretty print JSON
                resolve(output); // Resolve the promise with the output
            } catch (error) {
                console.error(`Failed to parse JSON output: ${data}`);
                reject(new Error('Failed to parse JSON output'));
            }
        });

        // Handle standard error
        result.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
            reject(new Error(`Error: ${data}`)); // Reject the promise with the error
        });

        // Handle process exit
        result.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`Child process exited with error code: ${code}`));
            }
        });
    });
}

// Function to write to the database
function writeDB(serverId, loggerChannelId) {
    return new Promise((resolve, reject) => {
        const result = spawn('python', ['./db/database.py', 'write', serverId, loggerChannelId]);

        // Handle standard output
        result.stdout.on('data', (data) => {
            const output = data.toString().trim();
            if (output === '200') {
                console.log('Write successful');
                resolve('Write successful'); // Resolve the promise on success
            } else {
                console.error(`Unexpected output: ${output}`);
                reject(new Error('Write failed')); // Reject the promise on unexpected output
            }
        });

        // Handle standard error
        result.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
            reject(new Error(`Error: ${data}`)); // Reject the promise with the error
        });

        // Handle process exit
        result.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`Child process exited with error code: ${code}`));
            }
        });
    });
}

// Export the functions for use in other modules
module.exports = {
    readDB,
    writeDB,
};
