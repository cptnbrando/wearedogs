class SamplerStore {
  customClips = $state([]);

  constructor() {
    this.load();
  }

  load() {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("wearedogs_custom_clips");
      if (data) {
        try {
          this.customClips = JSON.parse(data);
        } catch (e) {
          console.error("Failed to parse custom clips", e);
        }
      }
    }
  }

  save() {
    if (typeof window !== "undefined") {
      localStorage.setItem("wearedogs_custom_clips", JSON.stringify(this.customClips));
    }
  }

  addClip(clip) {
    const defaultColor = ["#ff55bb", "#00bfff", "#ffcc00", "#00ff66"][this.customClips.length % 4];
    const keys = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "a", "s", "d", "f", "g", "h"];
    const key = keys[this.customClips.length % keys.length];

    this.customClips.push({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      color: defaultColor,
      key,
      ...clip
    });
    this.save();
  }

  removeClip(id) {
    this.customClips = this.customClips.filter(c => c.id !== id);
    this.save();
  }
}

export const samplerStore = new SamplerStore();
