from speechbrain.inference.speaker import SpeakerRecognition

threshold = 0.4
pragyam_sample = "samples/pragyam_sample.wav"

recognizer = SpeakerRecognition.from_hparams(
    source="speechbrain/spkrec-ecapa-voxceleb",
    savedir="pretrained_models/spkrec-ecapa-voxceleb"
)

def same_voice(voice_sample):
    score, prediction = recognizer.verify_files(pragyam_sample, voice_sample)
    print(f"Score: {score.item():.4f}")
    return score.item() > threshold
