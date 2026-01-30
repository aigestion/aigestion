#!/usr/bin/env python3
"""
Generate PWA icons programmatically using PIL
"""

from pathlib import Path

from PIL import Image, ImageDraw

directories = [
    Path(__file__).parent.parent / 'frontend' / 'apps' / 'website-epic' / 'public' / 'icons',
    Path(__file__).parent.parent / 'deploy_dist' / 'icons',
    Path(__file__).parent.parent / 'deploy_dist_manual' / 'icons',
]

sizes = [72, 96, 128, 144, 152, 192, 384, 512]

def create_gradient_icon(size):
    """Create a gradient icon with Nexus branding"""
    # Create image with dark background
    img = Image.new('RGB', (size, size), color=(1, 1, 3))  # Dark nexus color
    draw = ImageDraw.Draw(img, 'RGBA')

    # Draw a simple gradient-like design
    # Purple to cyan gradient circle
    center = size // 2
    radius = int(size * 0.35)

    # Draw purple circle (outer)
    draw.ellipse(
        [center - radius, center - radius, center + radius, center + radius],
        fill=(138, 43, 226, 200),
        outline=(168, 85, 247, 255),
        width=2
    )

    # Draw cyan circle (inner)
    inner_radius = int(radius * 0.6)
    draw.ellipse(
        [center - inner_radius, center - inner_radius, center + inner_radius, center + inner_radius],
        fill=(34, 211, 238, 180),
        outline=(0, 245, 255, 255),
        width=1
    )

    return img

def generate_icons():
    """Generate icons at all required sizes"""
    try:
        print("📱 Generating PWA icons programmatically\n")

        for dir_path in directories:
            dir_path.mkdir(parents=True, exist_ok=True)

            for size in sizes:
                output_path = dir_path / f'icon-{size}x{size}.png'

                if output_path.exists() and output_path.stat().st_size > 0:
                    print(f"✅ {dir_path.name}/icon-{size}x{size}.png (already exists)")
                    continue

                img = create_gradient_icon(size)
                img.save(output_path, 'PNG')
                print(f"✅ Generated {dir_path.name}/icon-{size}x{size}.png")

        print("\n🎉 Icon generation complete!")
        return True

    except Exception as e:
        print(f"❌ Error generating icons: {e}")
        import traceback
        traceback.print_exc()
if __name__ == '__main__':
    success = generate_icons()
    exit(0 if success else 1)
