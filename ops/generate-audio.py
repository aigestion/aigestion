#!/usr/bin/env python3
"""
Generate minimal valid MP3 files for audio sounds
Using a simple MP3 frame header
"""

import struct
from pathlib import Path


def create_minimal_mp3(duration_ms=200):
    """
    Create a minimal valid MP3 file
    MP3 frame: FF FB 10 00 (valid MPEG-1 Layer 3 frame header)
    """
    # MP3 frame header for a valid minimal frame
    # FF FB 10 00 = MPEG-1 Layer 3, 128kbps, 44.1kHz, no CRC
    frame_header = bytes([0xFF, 0xFB, 0x10, 0x00])

    # Minimum MP3 frame data (mostly zeros after header)
    frame_data = frame_header + bytes(142)  # Minimal frame is ~146 bytes

    # ID3v2 header for metadata (optional but makes it more valid)
    id3_header = b'ID3'  # Identifier
    id3_header += bytes([4, 0])  # Version 2.4.0
    id3_header += bytes([0])  # Flags
    id3_header += bytes([0, 0, 0, 0])  # Size (0 bytes of data)

    return id3_header + frame_data

def generate_audio_files():
    """Generate minimal MP3 files in sounds directory"""
    sounds_dir = Path(__file__).parent.parent / 'sounds'
    sounds_dir.mkdir(parents=True, exist_ok=True)

    sound_names = [
        'click_activate',
        'data_pulse',
        'error_buzzer',
        'hover_glass',
        'menu_open',
        'nexus_hum',
        'success_chime',
        'wuaw_subtle'
    ]

    print("🎵 Generating minimal MP3 audio files\n")

    for sound_name in sound_names:
        output_path = sounds_dir / f'{sound_name}.mp3'

        try:
            mp3_data = create_minimal_mp3()
            with open(output_path, 'wb') as f:
                f.write(mp3_data)
            size = output_path.stat().st_size
            print(f"✅ Generated {sound_name}.mp3 ({size} bytes)")
        except Exception as e:
            print(f"❌ Error generating {sound_name}.mp3: {e}")

    print("\n🎉 Audio generation complete!")

if __name__ == '__main__':
    generate_audio_files()
