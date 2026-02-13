param ()

# Mocking available 3D generation models/styles for Shap-E/Point-E integration
$styles = @(
    @{ id = "shap-e"; name = "Shap-E (High Quality)"; description = "Text-to-3D using signed distance functions" },
    @{ id = "point-e"; name = "Point-E (Fast)"; description = "Point cloud based generation" },
    @{ id = "stable-dreamer"; name = "Stable Dreamer"; description = "High fidelity latent diffusion 3D" }
)

$styles | ConvertTo-Json
