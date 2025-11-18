export type SpeechType = "PREPARED" | "TABLE_TOPIC" | "EVALUATION" | "CUSTOM";

export type TimingStatus = "UNDER" | "WITHIN" | "OVER" | "DISQUALIFIED";

export interface TimingProfile {
  minSeconds: number;
  greenSeconds: number;
  yellowSeconds: number;
  redSeconds: number;
  redBlinkSeconds: number;
}

export interface Speaker {
  id: string;
  name: string;
  speechType: SpeechType;
  timingProfile: TimingProfile;
  actualSeconds?: number;
  status?: TimingStatus;
}

export interface Meeting {
  id: string;
  name: string;
  date: string;
  speakers: Speaker[];
}

export const TIMING_PROFILES: Record<SpeechType, TimingProfile> = {
  PREPARED: {
    minSeconds: 300, // 5:00
    greenSeconds: 300,
    yellowSeconds: 360, // 6:00
    redSeconds: 420, // 7:00
    redBlinkSeconds: 450, // 7:30
  },
  TABLE_TOPIC: {
    minSeconds: 60, // 1:00
    greenSeconds: 60,
    yellowSeconds: 90, // 1:30
    redSeconds: 120, // 2:00
    redBlinkSeconds: 150, // 2:30
  },
  EVALUATION: {
    minSeconds: 120, // 2:00
    greenSeconds: 120,
    yellowSeconds: 150, // 2:30
    redSeconds: 180, // 3:00
    redBlinkSeconds: 210, // 3:30
  },
  CUSTOM: {
    minSeconds: 0,
    greenSeconds: 0,
    yellowSeconds: 0,
    redSeconds: 0,
    redBlinkSeconds: 0,
  },
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const getTimingStatus = (
  actualSeconds: number,
  profile: TimingProfile
): TimingStatus => {
  if (actualSeconds < profile.minSeconds || actualSeconds > profile.redBlinkSeconds) {
    return "DISQUALIFIED";
  }
  if (actualSeconds >= profile.greenSeconds && actualSeconds < profile.redSeconds) {
    return "WITHIN";
  }
  if (actualSeconds < profile.greenSeconds) {
    return "UNDER";
  }
  return "OVER";
};
