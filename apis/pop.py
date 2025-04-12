# Do not run
# Takes way too long for demo
# Have some pre-loaded demos

Automatically generated by Colab.

Original file is located at
    https://colab.research.google.com/drive/1TeV6lVhmu9wL_HMPM8I4zZGgBdwUdscI
"""

!pip install torch torchaudio
!pip install speechbrain

import torch
import torchaudio
from speechbrain.pretrained import SpeakerRecognition

def load_audio(path):
    waveform, sample_rate = torchaudio.load(path)
    if waveform.shape[0] > 1:
        waveform = waveform.mean(dim=0).unsqueeze(0)  # Convert to mono
    return waveform, sample_rate

def save_audio(path, waveform, sample_rate):
    torchaudio.save(path, waveform, sample_rate)

def perturb_voice(input_path, output_path, steps=300, epsilon=0.01, lr=1e-3):
    print("Loading speaker recognition model...")
    spkrec = SpeakerRecognition.from_hparams(
        source="speechbrain/spkrec-ecapa-voxceleb",
        savedir="tmp_spkrec"
    )

    print("Loading original audio...")
    waveform, sample_rate = load_audio(input_path)
    waveform = waveform.clone().detach()

    print("Computing original speaker embedding...")
    with torch.no_grad():
        original_embed = spkrec.encode_batch(waveform)

    # Initialize a small random noise tensor
    perturbation = torch.randn_like(waveform) * 0.001
    perturbation.requires_grad = True

    optimizer = torch.optim.Adam([perturbation], lr=lr)

    print("Optimizing perturbation...")
    for step in range(steps):
        optimizer.zero_grad()
        perturbed_waveform = torch.clamp(waveform + perturbation, -1.0, 1.0)

        perturbed_embed = spkrec.encode_batch(perturbed_waveform)
        # Loss: negative cosine similarity (maximize distance)
        cosine = torch.nn.functional.cosine_similarity(original_embed, perturbed_embed)
        loss = -cosine.mean()

        loss.backward()
        optimizer.step()

        # Clamp the perturbation to remain within epsilon
        with torch.no_grad():
            perturbation[:] = torch.clamp(perturbation, -epsilon, epsilon)

        if step % 50 == 0 or step == steps - 1:
            print(f"Step {step+1}/{steps}, Loss: {loss.item():.6f}")

    final_waveform = torch.clamp(waveform + perturbation.detach(), -1.0, 1.0)
    save_audio(output_path, final_waveform, sample_rate)
    print(f"✅ Perturbed audio saved to: {output_path}")

from google.colab import files

print("Please select your input .wav file:")
uploaded = files.upload()  # Use the file selector to upload your file

# Get the name of the uploaded file
input_filename = next(iter(uploaded))
print("Uploaded file:", input_filename)

# Define output file name
output_filename = "protected_voice.wav"

# Run the perturbation process
perturb_voice(input_filename, output_filename, steps=100, epsilon=0.01, lr=1e-3)

from google.colab import files

files.download(output_filename)
