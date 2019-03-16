if(process.env.ENV === 'development')
    var backendBaseUrl = "https://dev-hub-server-staging.k8.devfactory.com"
else
    var backendBaseUrl = "https://dev-hub-server.k8.devfactory.com"

console.log("backend URl", backendBaseUrl)

var backendAddonsUrl = backendBaseUrl + "/api/addons/"
var backendImportUrl = backendBaseUrl + "/api/onboard/"
var adminCheckUrl = backendBaseUrl + "/api/admin_access_check/"
var promoteUrl = backendBaseUrl + "/api/promote_app/"

exports.backendImportUrl = backendImportUrl;
exports.backendAddonsUrl = backendAddonsUrl;
exports.adminCheckUrl = adminCheckUrl;
exports.promoteUrl = promoteUrl;