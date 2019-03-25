if(process.env.ENV === 'development')
    var backendBaseUrl = "https://dev-hub-server-staging.k8.devfactory.com"
else
    var backendBaseUrl = "https://dev-hub-server.k8.devfactory.com"

console.log("backend URl", backendBaseUrl)

var addonsUrl = backendBaseUrl + "/api/addons/"
var importUrl = backendBaseUrl + "/api/onboard/"
var adminCheckUrl = backendBaseUrl + "/api/admin_access_check/"
var promoteUrl = backendBaseUrl + "/api/promote_app/"
var issueUrl = backendBaseUrl + "/api/issues/"
var branchUrl = backendBaseUrl + "/api/branches/"
var prUrl = backendBaseUrl + "/api/prs/"

exports.importUrl = importUrl;
exports.addonsUrl = addonsUrl;
exports.adminCheckUrl = adminCheckUrl;
exports.promoteUrl = promoteUrl;
exports.issueUrl = issueUrl;
exports.branchUrl = branchUrl;
exports.prUrl = prUrl;
