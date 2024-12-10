function pause(duration) {
    return new Promise(resolve => {
        setTimeout(resolve, duration);
    });
}

async function fillDemarche() {
    const jsonData = await chrome.storage.local.get("jsonData");
    const progress = await chrome.storage.local.get("in_progress");

    if (jsonData.jsonData && jsonData.jsonData.input) {
        const jsonArray = jsonData.jsonData.input;

        for (const element of jsonArray) {
            if (element.page === progress.in_progress) {
                const inputData = element.input;
                const typeId = inputData.css_target_id;
                let elementToFill;

                switch (inputData.type) {
                    case "button":
                        elementToFill = document.getElementById(typeId) || document.getElementsByName(typeId)[0];

                        if (elementToFill) {
                            elementToFill.click();
                            await pause(1000);
                        }

                        break;
                    case "input":
                        elementToFill = document.getElementById(typeId) || document.getElementsByName(typeId)[0];

                        if (elementToFill) {
                            if (inputData.value === "click") {
                                elementToFill.click();
                            } else {
                                elementToFill.value = inputData.value;
                                elementToFill.dispatchEvent(new Event('input', { bubbles: true }));
                            }

                            await pause(1000);
                        }

                        break;
                    default:
                        console.warn(`Type ${inputData.type} non pris en charge`);
                        break;
                }
            }
        }

        chrome.runtime.sendMessage("DemacheDone");
    } else {
        console.error("Aucune donnée disponible...");
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fillDemarche") {
        fillDemarche();
    }
});