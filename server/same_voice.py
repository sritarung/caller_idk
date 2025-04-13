from speechbrain.inference.speaker import SpeakerRecognition

threshold = 0.4
pragyam_sample = "Tarun.wav"

recognizer = SpeakerRecognition.from_hparams(
    source="speechbrain/spkrec-ecapa-voxceleb",
    savedir="pretrained_models/spkrec-ecapa-voxceleb"
)

def same_voice(voice_sample_path):
    score, _ = recognizer.verify_files(pragyam_sample, voice_sample_path)
    print(f"Score: {score.item():.4f}")
    return score.item() > threshold

if __name__ == "__main__":
    print(same_voice("sample.wav"))  # only runs when directly executed
