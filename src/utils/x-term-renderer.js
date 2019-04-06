var os = require('os');
var pty = require('node-pty');
var Terminal = require('xterm').Terminal;
var remote = require('electron').remote

// Initialize node-pty with an appropriate shell
var shell = process.env[os.platform() === 'win32' ? 'COMSPEC' : 'SHELL'];
var ptyProcess = pty.spawn(shell, [], {
  name: 'xterm-color',
  cols: 120,
  rows: 30,
  cwd: process.cwd(),
  env: process.env
});

// Initialize xterm.js and attach it to the DOM
var xterm = new Terminal({
    cols: 120,
    rows: 30,
});
xterm.open(document.getElementById('xterm'));

var showUI = false;

// Setup communication between xterm.js and node-pty
xterm.on('data', (data) => {
    ptyProcess.write(data);
});

ptyProcess.on('data', function (data) {
    if(data.indexOf("@jx-") !== -1)
        showUI = true;
    if((data.indexOf("exit") !== -1 && data.length <= 8) || data.indexOf("# exit") !== -1){
        remote.getCurrentWindow().close();
    }
    if(showUI)
        xterm.write(data);
});

var appPath = remote.app.getAppPath();
//ptyProcess.write(`KUBECONFIG=${appPath}/k8s/config ${appPath}/k8s/kubectl --namespace __namespace__ --token __token__ exec -it __pod__ bash\n`)

var kubectl = "kubectl.exe"
if(process.platform === "darwin"){
    kubectl = "kubectl-darwin"
}
else if(process.platform === "linux"){
    kubectl = "kubectl-linux"
}

var token="k8s-aws-v1.aHR0cHM6Ly9zdHMuYW1hem9uYXdzLmNvbS8_QWN0aW9uPUdldENhbGxlcklkZW50aXR5JlZlcnNpb249MjAxMS0wNi0xNSZYLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFJTVpaQkZCSUs0QzNJM1NBJTJGMjAxOTA0MDUlMkZ1cy1lYXN0LTElMkZzdHMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDE5MDQwNVQxNjI5MzVaJlgtQW16LUV4cGlyZXM9NjAmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JTNCeC1rOHMtYXdzLWlkJlgtQW16LVNpZ25hdHVyZT02YmIxM2U0N2JkYjdlNDVjMTQ1NGY0ZjE5YzkzMmQ1ZjE1ZDc5OGQyODk2NDQwYWZjMGZkNGVjMjQzNzkyNDI1"


ptyProcess.write(`KUBECONFIG=${appPath}/k8s/config ${appPath}/k8s/${kubectl} --namespace jx-production --token ${token} exec -it jx-production-cn-dev-hub-server-69cfd5ff8-t4jh6 bash\n`)
ptyProcess.write(`clear\n`)