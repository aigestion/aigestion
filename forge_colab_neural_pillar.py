
# --- Sovereign 3D Forge Generated Script ---
# Object: Neural Data Pillar

!pip install -q git+https://github.com/openai/shap-e.git

import torch
from shap_e.diffusion.sample import sample_latents
from shap_e.diffusion.gaussian_diffusion import diffusion_from_config
from shap_e.models.download import load_model, load_config
from shap_e.util.notebooks import create_pan_cameras, decode_latents, visualize_model

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"Using device: {device}")

xm = load_model('transmitter', device=device)
model = load_model('text300M', device=device)
diffusion = diffusion_from_config(load_config('diffusion'))

batch_size = 1
guidance_scale = 15.0
prompt = "A vertical pillar with hex-patterned surface, pulsating data streams inside (neon blue), floating data crystals on top. Cyberpunk aesthetic."

latents = sample_latents(
    batch_size=batch_size,
    model=model,
    diffusion=diffusion,
    guidance_scale=guidance_scale,
    model_kwargs=dict(texts=[prompt]),
    progress=True,
    clip_denoised=True,
    use_fp16=True,
    use_karras=True,
    karras_steps=64,
    sigma_min=1e-3,
    sigma_max=160,
    s_churn=0,
)

for i, latent in enumerate(latents):
    t = decode_latents(xm, latent)
    from shap_e.util.mesh import TriMesh
    mesh = t.mesh()
    mesh.write_obj(f"neural_pillar_{i}.obj")
    print(f"✅ Generated neural_pillar_{i}.obj")

print("\n🚀 DONE! Please download the .obj files and convert to .glb if needed.")
