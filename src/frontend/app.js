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

    // Tab Elements
    const tabWorld = document.getElementById('tab-world');
    const tabAssets = document.getElementById('tab-assets');
    const worldGenerator = document.getElementById('world-generator');
    const assetGenerator = document.getElementById('asset-generator');

    // Asset Generator Elements
    const generateAssetBtn = document.getElementById('generate-asset-btn');
    const assetPromptInput = document.getElementById('asset-prompt');
    const assetModelSelect = document.getElementById('asset-model');

    let pollingInterval;
    let currentSkyboxUrl = '';
    let currentAssetUrl = '';

    // Tab Switching Logic
    tabWorld.addEventListener('click', () => {
        tabWorld.classList.add('active');
        tabAssets.classList.remove('active');
        worldGenerator.classList.remove('hidden');
        assetGenerator.classList.add('hidden');
        // Reset results when switching
        resultContainer.classList.add('hidden');
    });

    tabAssets.addEventListener('click', () => {
        tabAssets.classList.add('active');
        tabWorld.classList.remove('active');
        assetGenerator.classList.remove('hidden');
        worldGenerator.classList.add('hidden');
        // Reset results when switching
        resultContainer.classList.add('hidden');
    });

    view3dBtn.addEventListener('click', () => {
        if (currentSkyboxUrl) {
            resultImage.classList.toggle('hidden');
            threeViewer.classList.toggle('hidden');
            threeViewer.src = currentSkyboxUrl;
            view3dBtn.innerText = threeViewer.classList.contains('hidden') ? 'View in 3D' : 'Back to Image';
        } else if (currentAssetUrl) {
            window.open(`asset-viewer.html?url=${encodeURIComponent(currentAssetUrl)}`, '_blank');
        }
    });

    /**
     * Handles the 3D asset generation lifecycle:
     * 1. Validate prompt
     * 2. Initiate request via Bridge/PowerShell
     * 3. Start polling for results
     */
    generateAssetBtn.addEventListener('click', async () => {
        const prompt = assetPromptInput.value.trim();
        const model = assetModelSelect.value;

        if (!prompt) {
            alert('Please enter an object description');
            return;
        }

        // Reset UI
        generateAssetBtn.disabled = true;
        resultContainer.classList.add('hidden');
        statusContainer.classList.remove('hidden');
        statusText.innerText = 'Analyzing prompt for 3D generation...';

        try {
            const response = await callPowerShell('assets/New-3DObjectRequest.ps1', { Prompt: prompt, Model: model });
            
            if (response.error) {
                throw new Error(response.error);
            }

            const requestId = response.id;
            statusText.innerText = 'Generating 3D model (Shap-E/Point-E)...';
            
            startAssetPolling(requestId);
        } catch (err) {
            alert('Asset Error: ' + err.message);
            statusContainer.classList.add('hidden');
            generateAssetBtn.disabled = false;
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

    function startAssetPolling(id) {
        pollingInterval = setInterval(async () => {
            try {
                const response = await callPowerShell('assets/Get-3DObjectStatus.ps1', { Id: id });
                
                if (response.status === 'complete') {
                    stopPolling();
                    showAssetResult(response);
                } else if (response.status === 'failed') {
                    stopPolling();
                    alert('Asset generation failed.');
                    statusContainer.classList.add('hidden');
                    generateAssetBtn.disabled = false;
                }
            } catch (err) {
                console.error('Asset polling error:', err);
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

    function showAssetResult(data) {
        statusContainer.classList.add('hidden');
        resultContainer.classList.remove('hidden');
        generateAssetBtn.disabled = false;
        
        // Reset viewer state
        threeViewer.classList.add('hidden');
        resultImage.classList.remove('hidden');
        view3dBtn.innerText = 'Explore 3D Model';

        resultImage.src = data.thumbnail_url;
        downloadLink.href = data.file_url;
        currentSkyboxUrl = '';
        currentAssetUrl = data.file_url;

        view3dBtn.classList.remove('hidden'); 
        downloadLink.innerText = 'Download 3D Model (' + data.format.toUpperCase() + ')';
    }

    /**
     * Helper to bridge to local PowerShell scripts for this MVP environment
     */
    async function callPowerShell(script, params) {
        console.log(`Requesting ${script} with`, params);
        
        // In a production environment with a real backend (Node/Python), 
        // this would be a real API call.
        // For this local MVP simulation, we simulate the wait for the bridge.
        
        return new Promise((resolve) => {
            // Simulate the bridge processing time
            setTimeout(() => {
                // Mock responses for the purpose of demonstrating the flow
                if (script === 'New-SkyboxScene.ps1') {
                    resolve({ id: "REQ_" + Math.random().toString(36).substr(2, 9), status: "pending" });
                } else if (script === 'Get-SkyboxStatus.ps1') {
                    // Simulate completion after a few polls
                    resolve({ 
                        status: "complete", 
                        file_url: "https://blockadelabs-skybox-production.s3.amazonaws.com/skybox/uploads/example.jpg",
                        glb_url: "https://blockadelabs-skybox-production.s3.amazonaws.com/skybox/uploads/example.glb",
                        skybox_url: "https://blockadelabs.com/view/example"
                    });
                }
            }, 1500);
        });
    }
});
