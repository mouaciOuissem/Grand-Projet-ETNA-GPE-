// script.js

let logoutTimer;

function autoCheckCookie() {
    chrome.storage.local.set({ "popupOpened": false });
}

function resetLogoutTimer() {
    clearTimeout(logoutTimer);
    logoutTimer = setTimeout(autoCheckCookie, 2000);
}

function getWebsites() {
    return new Promise((resolve, reject) => {
        let req = new XMLHttpRequest();

        req.open("GET", "https://www.snl-corp.fr/api/process/", true);
        req.setRequestHeader("Content-Type", "application/json");

        req.onload = function() {
            if (req.status >= 200 && req.status < 300) {
                resolve(JSON.parse(req.response));
            } else {
                reject("Erreur lors de la récupération des données:" + req.statusText);
            }
        };

        req.onerror = function() {
            reject("Erreur réseau.");
        };

        req.send();
    })
}

function homeishome(tabUrl, valid) {
    if (tabUrl.indexOf("https://www.snl-corp.fr/") > -1) {
        document.location.href = "homeishome.html";
    } else if (!valid) {
        document.location.href = "unsupported.html";
    }
}

document.addEventListener('DOMContentLoaded', function () {
    var detectAidButton = document.getElementById("detect-aid-btn");
    var confirmAidButton = document.getElementById("confirm-aid-btn");
    var fillPageButton = document.getElementById("fill-page");

    resetLogoutTimer();

    chrome.storage.local.set({ "injection": false });
    chrome.storage.local.set({ "demarche": false });
    chrome.storage.local.set({ "in_progress": 0 });

    chrome.storage.local.get(["popupOpened"]).then((result) => {
        if (result["popupOpened"] === undefined || result["popupOpened"] === false) {
            chrome.runtime.sendMessage("popupOpened");
        }
    });

    chrome.tabs.query({ active: true, lastFocusedWindow: true }, async function(tabs) {
        if (tabs && tabs.length > 0) {
            var tab = tabs[0];
            var tabUrl = tab.url;
            var valid = false;

            await getWebsites()
            .then((response) => {
                const websites = JSON.parse(JSON.stringify(response.process));

                websites.forEach(el => {
                    if (el.url !== null && tabUrl.indexOf(el.url) > -1) {
                        valid = true;
                    }
                });
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                homeishome(tabUrl, valid);
            });
        }
    });

    // Écouter les messages du background.js pour gérer la redirection
    chrome.runtime.onMessage.addListener((message) => {
        if (message.redirect) {
            document.location.href = message.redirect;
        }

        if (message === "DemacheDone") {
            alert('Auto remplissage terminer !');

            chrome.storage.local.get(["UserHasProcessId"]).then((result) => {
                const UserHasProcessId = result.UserHasProcessId
                let datas = JSON.stringify({ "StatusId": 3 });
                let req = new XMLHttpRequest();

                req.open("PATCH", "https://www.snl-corp.fr/api/update_process_status_by_user/" + UserHasProcessId, true);
                req.setRequestHeader("Content-Type", "application/json");

                req.onload = function() {
                    if (req.status >= 200 && req.status < 300) {
                        let jsonData = JSON.parse(req.response);

                        chrome.storage.local.set({ 
                            "UserHasProcessId": jsonData.newUserHasProcess.id
                        });
                    } else {
                        console.error("Erreur lors de la récupération des données:", req.statusText);
                    }
                };

                req.onerror = function() {
                    console.error("Erreur réseau.");
                };

                req.send(datas);
            });
        }
    });

    document.querySelector("button#fill-page").addEventListener("click", (e) => {
        e.preventDefault();
        chrome.storage.local.set({ "injection": true });
    });

    document.querySelector("button#logout").addEventListener("click", (e) => {
        e.preventDefault();

        fetch("https://www.snl-corp.fr/api/auth/logout/", { method: "POST" })
        .then(response => {
            chrome.storage.local.clear(() => {
                if (chrome.runtime.lastError) {
                    console.error("Erreur lors de la suppression du stockage local :", chrome.runtime.lastError);
                } else {
                    document.location.href = "login.html";
                }
            });
    
            document.location.href = "login.html";
        })
        .catch(error => {
            console.error("Erreur lors de la requête:", error);
            chrome.storage.local.set({ "logged": false, "popupOpened": false });
            chrome.runtime.sendMessage({ redirect: "login.html" });
        });
    });

    chrome.storage.local.get(["logged"]).then((result) => {
        if (result["logged"] === undefined || result["logged"] === false) {
            document.location.href = "login.html";
        }
    });

    if (detectAidButton) {
        detectAidButton.addEventListener("click", function() {
            // Send a message to the background script to get the current tab's URL
            chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tabs) {
                if (tabs && tabs.length > 0) {
                    var tab = tabs[0];
                    var tabUrl = tab.url;

                    // Check if URL matches the condition
                    if (tabUrl === "https://wwwd.caf.fr/wps/portal/caffr/simulateurpa/") {
                        // Show the aid result section
                        document.getElementById("aid-result").style.display = "block";
                        // Show the aid text
                        document.getElementById("aid-text").innerText = "Prime d'activité";
                    }
                }
            });
        });
    }

    if (confirmAidButton) {
        confirmAidButton.addEventListener("click", function() {
            window.location.href = "../pages/index.html";
        });
    }

    if (fillPageButton) {
        fillPageButton.addEventListener("click", function() {
            chrome.storage.local.get(["in_progress"]).then((result) => {
                let datas = JSON.stringify({ "url": "https://wwwd.caf.fr/wps/portal/caffr/simulateurpa/" });
                let req = new XMLHttpRequest();

                req.open("POST", "https://www.snl-corp.fr/api/process/user/information/", true);
                req.setRequestHeader("Content-Type", "application/json");

                req.onload = function() {
                    if (req.status >= 200 && req.status < 300) {
                        let jsonData = JSON.parse(req.response);

                        chrome.storage.local.set({ 
                            "demarche": true, 
                            "in_progress": (result.in_progress || 0) + 1,
                            "jsonData": jsonData 
                        });
                    } else {
                        console.error("Erreur lors de la récupération des données:", req.statusText);
                    }
                };

                req.onerror = function() {
                    console.error("Erreur réseau.");
                };

                req.send(datas);
            });

            chrome.storage.local.get(["jsonData"]).then((result) => {
                const ProcessId = result.jsonData.process.id;
                let datas = JSON.stringify({ "ProcessId": ProcessId, "StatusId": 1 });
                let req = new XMLHttpRequest();

                req.open("POST", "https://www.snl-corp.fr/api/assign_process_to_user/", true);
                req.setRequestHeader("Content-Type", "application/json");

                req.onload = function() {
                    if (req.status >= 200 && req.status < 300) {
                        let UserHasProcessData = JSON.parse(req.response);

                        chrome.storage.local.set({ 
                            "UserHasProcessId": UserHasProcessData.newUserHasProcess.id
                        });
                    } else {
                        console.error("Erreur lors de la récupération des données:", req.statusText);
                    }
                };

                req.onerror = function() {
                    console.error("Erreur réseau.");
                };

                req.send(datas);
            });
        });
    }
});
