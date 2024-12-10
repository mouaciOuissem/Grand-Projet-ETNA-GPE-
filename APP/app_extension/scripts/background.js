/**
 * File Name: background.js
 * Description: This script is injected in the web site for manipulate inputs and button.
 * Author: Prosy
 * Created Date: February 9, 2024
 * Version: 1.0
 */


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message === "popupOpened") {
        fetch("https://www.snl-corp.fr/api/auth/check-cookie")
            .then(response => response.json()) // Convertir la réponse en JSON
            .then(data => {
                if (data.isAuthenticated) {
                    chrome.storage.local.set({ "logged": true, "popupOpened": true});
                    chrome.runtime.sendMessage({ redirect: "index.html" });
                } else {
                    chrome.storage.local.set({ "logged": false, "popupOpened": false });
                    chrome.runtime.sendMessage({ redirect: "login.html" });
                }
            })
            .catch(error => {
                console.error("Erreur lors de la requête:", error);
                chrome.storage.local.set({ "logged": false, "popupOpened": false });
                chrome.runtime.sendMessage({ redirect: "login.html" });
            });

        return true; // On indique que la réponse est asynchrone
    }
});

// Écoutez les changements dans le stockage
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (changes.demarche) {
        const newValue = changes.demarche.newValue;

        if (newValue === true) {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs.length > 0) {
                    chrome.tabs.sendMessage(tabs[0].id, { action: "fillDemarche" });
                } else {
                    console.error(tabs);
                }
            });
        }
    }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {

        chrome.storage.local.get(["demarche", "in_progress"], (result) => {
            if (result.demarche === true) {
                let newProgress = (result.in_progress || 0) + 1;

                chrome.storage.local.set({ "in_progress": newProgress });
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    if (tabs.length > 0) {
                        chrome.tabs.sendMessage(tabs[0].id, { action: "fillDemarche" }, (response) => {
                            console.log("Réponse du script de contenu : ", response);
                        });
                    } else {
                        console.error("Aucun onglet actif trouvé.");
                    }
                });
            } else {
                console.log("'demarche' n'est pas true, aucun message envoyé");
            }
        });
    }
});