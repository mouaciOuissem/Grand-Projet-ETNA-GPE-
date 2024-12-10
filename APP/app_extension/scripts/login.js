document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("signup-btn").addEventListener("click", (e) => {
        e.preventDefault();
    
        chrome.tabs.create({
            url: "https://www.snl-corp.fr/auth/register"
        });
    });

    chrome.runtime.onMessage.addListener((message) => {
        if (message.redirect) {
            document.location.href = message.redirect;
        }
    });

    document.getElementById("login-submit-btn").addEventListener("click", (e) => {
        e.preventDefault();
    
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
    
        if (email.length > 0 && password.length > 0) {
            let datas = JSON.stringify({ "identifier": email, "password": password });
            let req = new XMLHttpRequest();

            req.open("POST", "https://www.snl-corp.fr/api/auth/login/", true);
            req.setRequestHeader("Content-Type", "application/json");
            req.withCredentials = true;

            req.onload = function() {
                if (req.status >= 200 && req.status < 300) {
                    chrome.storage.local.set({ "logged": true });
                    document.location.href = "index.html";
                } else {
                    alert("Erreur lors de la connexion. Veuillez vérifier vos identifiants.");
                }
            };
    
            req.onerror = function() {
                alert("Erreur de réseau. Veuillez réessayer plus tard.");
            };
    
            req.send(datas);
        } else {
            alert("veuillez entré des identifiants valide...");
        }
    });
});