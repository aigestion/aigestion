import os
import json
import textwrap


def generate_colab_script(request_file):
    with open(request_file, "r") as f:
        request = json.load(f)

    prompt = request.get("description", "Generic 3D object")
    object_id = request.get("id", "object")

    colab_code = f"""
    # --- Sovereign 3D Forge Generated Script ---
    # Object: {request.get('name', object_id)}
    
    !pip install -q git+https://github.com/openai/shap-e.git

    import torch
    from shap_e.diffusion.sample import sample_latents
    from shap_e.diffusion.gaussian_diffusion import diffusion_from_config
    from shap_e.models.download import load_model, load_config
    from shap_e.util.notebooks import create_pan_cameras, decode_latents, visualize_model

    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Using device: {{device}}")

    xm = load_model('transmitter', device=device)
    model = load_model('text300M', device=device)
    diffusion = diffusion_from_config(load_config('diffusion'))

    batch_size = 1
    guidance_scale = 15.0
    prompt = "{prompt}"

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
        mesh.write_obj(f"{object_id}_{{i}}.obj")
        print(f"✅ Generated {object_id}_{{i}}.obj")
    
    print("\\n🚀 DONE! Please download the .obj files and convert to .glb if needed.")
    """

    output_path = f"forge_colab_{object_id}.py"
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(textwrap.dedent(colab_code))

    print(f"DONE: Colab script generated: {output_path}")


if __name__ == "__main__":
    # Example usage: targeting the first request
    request_dir = "models/forge_requests"
    if os.path.exists(request_dir):
        files = [f for f in os.listdir(request_dir) if f.endswith(".json")]
        for f in files:
            generate_colab_script(os.path.join(request_dir, f))
    else:
        print(f"❌ Request directory not found: {request_dir}")
