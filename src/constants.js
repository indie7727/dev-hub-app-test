if(process.env.ENV === 'development'){
    var backendBaseUrl = "https://dev-hub-server-staging.k8.devfactory.com";
    var cloudMessagingSenderId = 565512589939;
} else {
    var backendBaseUrl = "https://dev-hub-server.k8.devfactory.com";
    var cloudMessagingSenderId = 646086604998;
}

console.log("backend URl", backendBaseUrl)

var addonsUrl = backendBaseUrl + "/api/addons/"
var importUrl = backendBaseUrl + "/api/onboard/"
var adminCheckUrl = backendBaseUrl + "/api/admin_access_check/"
var promoteUrl = backendBaseUrl + "/api/promote_app/"
var issueUrl = backendBaseUrl + "/api/issues/"
var branchUrl = backendBaseUrl + "/api/branches/"
var prUrl = backendBaseUrl + "/api/prs/"
var wsideUrl = backendBaseUrl + "/api/wside/"
var repoDebugUrl = backendBaseUrl + "/api/repo_debug/"

exports.importUrl = importUrl;
exports.addonsUrl = addonsUrl;
exports.adminCheckUrl = adminCheckUrl;
exports.promoteUrl = promoteUrl;
exports.issueUrl = issueUrl;
exports.branchUrl = branchUrl;
exports.prUrl = prUrl;
exports.wsideUrl = wsideUrl;
exports.repoDebugUrl = repoDebugUrl;
exports.cloudMessagingSenderId = cloudMessagingSenderId;