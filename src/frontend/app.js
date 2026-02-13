document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const promptInput = document.getElementById('prompt');
    const styleSelect = document.getElementById('style');
    const statusContainer = document.getElementById('status-container');
    const statusText = document.getElementById('status-text');
    const resultContainer = document.getElementById('result-container');
    const resultImage = document.getElementById('result-image');
    const threeViewer = document.getElementById('three-viewer');
    const downloadLink = document.getElementById('download-link');
    const view3dBtn = document.getElementById('view-3d-btn');

    let pollingInterval;
    let currentSkyboxUrl = '';

    view3dBtn.addEventListener('click', () => {
        if (currentSkyboxUrl) {
            resultImage.classList.toggle('hidden');
            threeViewer.classList.toggle('hidden');
            threeViewer.src = currentSkyboxUrl;
            view3dBtn.innerText = threeViewer.classList.contains('hidden') ? 'View in 3D' : 'Back to Image';
        }
    });

    generateBtn.addEventListener('click', async () => {
        const prompt = promptInput.value.trim();
        const styleId = styleSelect.value;

        if (!prompt) {
            alert('Please enter a prompt');
            return;
        }

        // Reset UI
        generateBtn.disabled = true;
        resultContainer.classList.add('hidden');
        statusContainer.classList.remove('hidden');
        statusText.innerText = 'Initiating generation...';

        try {
            // In a real app, this would be a POST to your backend
            // For this MVP, we simulate it via a local request or bridge
            const response = await callPowerShell('New-SkyboxScene.ps1', { Prompt: prompt, StyleId: styleId });
            
            if (response.error) {
                throw new Error(response.error);
            }

            const generationId = response.id || response.request_id;
            statusText.innerText = 'Generating 3D world (this may take a minute)...';
            
            startPolling(generationId);
        } catch (err) {
            alert('Error: ' + err.message);
            statusContainer.classList.add('hidden');
            generateBtn.disabled = false;
        }
    });

    function startPolling(id) {
        pollingInterval = setInterval(async () => {
            try {
                const response = await callPowerShell('Get-SkyboxStatus.ps1', { Id: id });
                
                if (response.status === 'complete' || response.request?.status === 'complete') {
                    stopPolling();
                    showResult(response.request || response);
                } else if (response.status === 'failed' || response.request?.status === 'failed') {
                    stopPolling();
                    alert('Generation failed.');
                    statusContainer.classList.add('hidden');
                    generateBtn.disabled = false;
                }
            } catch (err) {
                console.error('Polling error:', err);
            }
        }, 5000);
    }

    function stopPolling() {
        clearInterval(pollingInterval);
    }

    function showResult(data) {
        statusContainer.classList.add('hidden');
        resultContainer.classList.remove('hidden');
        generateBtn.disabled = false;
        
        // Reset viewer state
        threeViewer.classList.add('hidden');
        resultImage.classList.remove('hidden');
        view3dBtn.innerText = 'View in 3D';

        // Skybox API returns various URLs
        resultImage.src = data.file_url || data.image_url;
        downloadLink.href = data.glb_url || '#';
        currentSkyboxUrl = data.skybox_url || '';

        if (!currentSkyboxUrl) {
            view3dBtn.classList.add('hidden');
        } else {
            view3dBtn.classList.remove('hidden');
        }
        
        if (!data.glb_url) {
            downloadLink.innerText = 'GLB Export not available';
        } else {
            downloadLink.innerText = 'Download GLB';
        }
    }

    /**
     * Helper to bridge to local PowerShell scripts for this MVP environment
     */
    async function callPowerShell(script, params) {
        // This is a placeholder for the logic that will be handled by our local runner
        // In this environment, we will use a JSON-based bridge
        console.log(`Calling ${script} with`, params);
        
        // We expect a 'bridge.json' to be updated by a background process
        // For demonstration, we return a mock success if we were just testing UI
        // But we will implement the actual bridge in the next commits
        return { id: "MOCK_ID_" + Date.now(), status: "pending" };
    }
});
