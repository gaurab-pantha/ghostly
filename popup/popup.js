document.addEventListener('DOMContentLoaded', () => {
    const checkButton = document.getElementById('check-unfollowers');
    const statusDiv = document.getElementById('status');

    if (checkButton) {
        checkButton.addEventListener('click', async () => {
            statusDiv.textContent = "Scanning profiles safely...";
            
            try {
                // Query the active tab safely using async/await
                let [tab] = await browser.tabs.query({ active: true, currentWindow: true });
                
                if (tab) {
                    // Send message safely to content scripts
                    browser.tabs.sendMessage(tab.id, { action: "start_scan" }, (response) => {
                        if (browser.runtime.lastError) {
                            statusDiv.textContent = "Please refresh the target page and try again.";
                        } else if (response && response.status) {
                            statusDiv.textContent = response.status;
                        }
                    });
                }
            } catch (error) {
                statusDiv.textContent = "Error running scan engine.";
                console.error(`Error: ${error}`);
            }
        });
    }
});
