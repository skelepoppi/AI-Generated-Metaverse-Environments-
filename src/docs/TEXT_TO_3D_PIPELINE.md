# Text-to-3D Object Pipeline (PromptSpace)

This module implements the **Text-to-3D Object Generation Pipeline** using Shap-E and Point-E architectures.

## Overview
PromptSpace allows users to generate specific 3D assets (furniture, items, characters) to populate their virtual environments. These assets are generated from text prompts and can be exported in standard formats like GLB.

## Pipeline Architecture
The pipeline follows a similar bridge-based architecture as the Skybox engine:

### 1. Request Initiation
- **Service**: `src/backend/services/assets/New-3DObjectRequest.ps1`
- **Logic**: Accepts a prompt and a model selection (Shap-E or Point-E). It returns a unique Request ID.

### 2. Status Polling
- **Service**: `src/backend/services/assets/Get-3DObjectStatus.ps1`
- **Logic**: Frontend polls this service using the Request ID to check if the 3D generation is complete.

### 3. Result Visualization
- **Viewer**: `src/frontend/asset-viewer.html`
- **Logic**: Utilizes Google's `<model-viewer>` web component to render the generated GLB file in an interactive 3D environment.

## Supported Models
- **Shap-E**: Generates high-quality 3D models using implicit functions.
- **Point-E**: Optimized for speed, generating 3D point clouds that are then converted to meshes.

## How to Use
1. Select the **Assets** tab in the PromptSpace dashboard.
2. Enter a detailed description of the object you want to create.
3. Choose the AI model (Shap-E is recommended for quality).
4. Click **Generate 3D Object**.
5. Once ready, click **Explore 3D Model** to view it or **Download GLB** to save it.

## Future Enhancements
- Integration with IPFS for permanent on-chain asset storage.
- Multi-object scene composition.
- Fine-tuning models for specific Metaverse categories.
