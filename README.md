# CallerIDK

CallerIDK is an AI-powered voice fraud detection system designed to detect and prevent deepfake voice scams, especially in sensitive financial settings.

---

## 🧠 Inspiration

AI-powered voice cloning has made deepfake scams dangerously realistic, leading to significant financial and emotional harm. For instance:
- A UK energy firm lost $243,000 to a deepfake impersonating their CEO.
- A mother was nearly tricked by a deepfake of her daughter's voice claiming a kidnapping.

These scams motivated us to build **CallerIDK** — a proactive tool that leverages AI to detect and prevent voice deepfakes.

---

## 💡 What It Does

CallerIDK analyzes calls or audio recordings in real-time to identify voice deepfakes and takes protective actions **before** any sensitive data is compromised.

Key Features:
- **Real-time Deepfake Detection**: Ensures the speaker is authentic.
- **Obfuscates Sensitive Data**: Protects data like account numbers or PINs.
- **Masks User Responses**: Reduces future cloning risk.
- **Logs & Flags Suspicious Calls**: Provides a defense layer against recurring scams.

### 🛠️ Add-ons for Real-World Application

- **Hidden Ultrasonic Messages**: Inserts inaudible frequencies to alter voice signatures, making future cloning harder.
- **Background Object Detection**: Analyzes ambient sounds/objects for environmental validation during suspicious calls.

---

## 🔨 How We Built It

- **Voice Deepfake Detection**: Trained an ML model on real and synthetic voice datasets to detect waveform inconsistencies.
- **Obfuscation System**: Subtly alters speech waves to disrupt cloning attempts.
- **Ultrasonic Messaging**: Embeds inaudible signals to further protect voice identity.
- **Background Detection**: Uses audio analysis to detect objects/sounds for additional context.
- **Frontend**: Built with **React**, featuring real-time call monitoring and flagging.
- **Backend**: Implemented with **Flask**, deployed via **Vercel** for quick hosting and testing.

---

## 🚧 Challenges

- Acquiring high-quality, varied datasets for voice deepfakes.
- Maintaining low latency during real-time detection.
- Balancing false positives and detection accuracy.
- Seamlessly integrating obfuscation without hurting call quality or UX.

---

## 🏆 Accomplishments

- Achieved **80% accuracy** in voice deepfake detection.
- Built a real-time monitoring system with **minimal lag**.
- Developed a **full-stack working prototype** during a hackathon, including all core modules.

---

## 📚 What We Learned

- Modern deepfake models are alarmingly advanced.
- Ethical AI is crucial — protection > gimmick.
- Building **detection** and **prevention** in tandem is tough but powerful.

---

## 🚀 What's Next for CallerIDK

- Integrate with **VOIP and customer service platforms** in finance.
- Add **multilingual support** for global user base.
- Expand training with new-gen models like **GPT-4 Voice**.
- Package obfuscation as a standalone **API** for fintech apps.
- Build a **browser extension** to detect scams on Zoom, WhatsApp, and other communication tools.

---

## 💻 Tech Stack

- **Frontend**: React, Vite
- **Backend**: Flask
- **Deployment**: Vercel
- **ML**: Custom-trained voice deepfake detection model
- **Audio Engineering**: Obfuscation layer with ultrasonic embedding

---

## 📬 Contact

Have feedback or ideas? We'd love to hear from you.

---

**CallerIDK** – Because not every voice is what it seems.
