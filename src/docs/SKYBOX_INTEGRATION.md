# Skybox AI Integration (PromptSpace)

This module integrates the **Blockade Labs Skybox AI API** to generate 360-degree immersive environments from text prompts.

## Architecture
Due to the minimal environment, this integration uses a **PowerShell-based backend bridge** to communicate with the Skybox API.

### Components
- **Backend Services (`src/backend/services/`)**:
  - `Get-SkyboxStyles.ps1`: Fetches available 3D styles.
  - `New-SkyboxScene.ps1`: Requests a new 3D scene generation.
  - `Get-SkyboxStatus.ps1`: Polls the status of a generation request.
- **Backend Bridge (`src/backend/Bridge.ps1`)**: A lightweight listener that executes PowerShell scripts based on JSON requests.
- **Frontend (`src/frontend/`)**: 
  - `index.html`: The user interface for prompt input and result viewing.
  - `app.js`: Handles UI logic, polling, and communication with the bridge.
  - `style.css`: Modern, responsive styling.

## Setup
1. Obtain an API Key from [Blockade Labs](https://www.blockadelabs.com/).
2. Open `src/backend/config.json`.
3. Replace `YOUR_SKYBOX_API_KEY` with your actual key.

## Running the Application
1. Run the `PromptSpace-Start.ps1` script in the project root.
2. This will launch the backend bridge and open the frontend in your browser.
3. Enter a prompt (e.g., "A floating castle in the clouds") and click **Generate**.
4. Once complete, you can view the environment in 3D or download the `.glb` file.

## Technical Details
- **API Version**: v1
- **Formats**: GLB, JPG
- **Styles**: Supports multiple IDs (Realistic, Cyberpunk, Digital Painting, etc.)
