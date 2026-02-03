#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Instalador automático de servicios de voz open-source para Daniela
"""

import subprocess
import sys
import os

# Fix Windows encoding
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"\n[*] {description}...")
    try:
        result = subprocess.run(
            command,
            shell=True,
            check=True,
            capture_output=True,
            text=True
        )
        print(f"[OK] {description} - Completado")
        return True
    except subprocess.CalledProcessError as e:
        print(f"[ERROR] Error en {description}")
        print(f"Error: {e.stderr}")
        return False

def check_python_version():
    """Check if Python version is compatible"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("[ERROR] Python 3.8+ es requerido")
        return False
    print(f"[OK] Python {version.major}.{version.minor}.{version.micro} detectado")
    return True

def check_ffmpeg():
    """Check if ffmpeg is installed"""
    try:
        subprocess.run(["ffmpeg", "-version"], capture_output=True, check=True)
        print("[OK] FFmpeg esta instalado")
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("[WARNING] FFmpeg no encontrado")
        print("   Instalar con: choco install ffmpeg (Windows)")
        print("   O desde: https://ffmpeg.org/download.html")
        return False

def install_voice_services():
    """Install Coqui TTS and Whisper"""
    print("\n" + "="*60)
    print("INSTALADOR DE SERVICIOS DE VOZ OPEN-SOURCE")
    print("="*60)

    # Check prerequisites
    if not check_python_version():
        return False

    ffmpeg_ok = check_ffmpeg()
    if not ffmpeg_ok:
        response = input("\n¿Continuar sin FFmpeg? (s/n): ")
        if response.lower() != 's':
            return False

    # Install pip packages
    packages = [
        ("TTS", "Coqui TTS (Text-to-Speech)"),
        ("openai-whisper", "Whisper (Speech-to-Text)"),
        ("ffmpeg-python", "FFmpeg Python bindings"),
        ("pydub", "Audio processing utilities")
    ]

    for package, description in packages:
        if not run_command(
            f"pip install {package}",
            f"Instalando {description}"
        ):
            print(f"\n⚠️  Error instalando {package}")
            response = input("¿Continuar con los demás paquetes? (s/n): ")
            if response.lower() != 's':
                return False

    # Test installations
    print("\n" + "="*60)
    print("🧪 VERIFICANDO INSTALACIONES")
    print("="*60)

    # Test Coqui TTS
    if run_command("tts --help", "Verificando Coqui TTS"):
        print("   Probando síntesis de voz...")
        run_command(
            'tts --text "Hola, soy Daniela" --model_name "tts_models/es/css10/vits" --out_path test_daniela.wav',
            "Generando audio de prueba"
        )

    # Test Whisper
    if run_command("whisper --help", "Verificando Whisper"):
        print("   Whisper está listo para transcripción")

    print("\n" + "="*60)
    print("✅ INSTALACIÓN COMPLETADA")
    print("="*60)
    print("\n📝 Próximos pasos:")
    print("1. Actualizar .env con USE_COQUI_TTS=true")
    print("2. Actualizar .env con USE_WHISPER_STT=true")
    print("3. Reiniciar el backend: npm run dev")
    print("\n📚 Ver INSTALL_VOICE_SERVICES.md para más detalles")

    return True

if __name__ == "__main__":
    try:
        success = install_voice_services()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n\n⚠️  Instalación cancelada por el usuario")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Error inesperado: {e}")
        sys.exit(1)
