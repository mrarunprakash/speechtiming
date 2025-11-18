import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Pause, RotateCcw } from "lucide-react";
import { Speaker, formatTime, getTimingStatus } from "@/types/timer";
import { cn } from "@/lib/utils";

interface TimerViewProps {
  speaker: Speaker;
  speakerNumber: number;
  totalSpeakers: number;
  onBack: () => void;
  onSaveAndNext: (actualSeconds: number) => void;
}

export const TimerView = ({
  speaker,
  speakerNumber,
  totalSpeakers,
  onBack,
  onSaveAndNext,
}: TimerViewProps) => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isBlink, setIsBlink] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const blinkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  useEffect(() => {
    if (seconds > speaker.timingProfile.redSeconds) {
      if (!blinkIntervalRef.current) {
        blinkIntervalRef.current = setInterval(() => {
          setIsBlink((prev) => !prev);
        }, 500);
      }
    } else {
      setIsBlink(false);
      if (blinkIntervalRef.current) {
        clearInterval(blinkIntervalRef.current);
        blinkIntervalRef.current = null;
      }
    }

    return () => {
      if (blinkIntervalRef.current) {
        clearInterval(blinkIntervalRef.current);
      }
    };
  }, [seconds, speaker.timingProfile.redSeconds]);

  const getBackgroundColor = () => {
    if (isBlink) {
      return "bg-timer-red animate-pulse";
    }
    if (seconds >= speaker.timingProfile.redSeconds) {
      return "bg-timer-red";
    }
    if (seconds >= speaker.timingProfile.yellowSeconds) {
      return "bg-timer-yellow";
    }
    if (seconds >= speaker.timingProfile.greenSeconds) {
      return "bg-timer-green";
    }
    return "bg-timer-neutral";
  };

  const getColorLabel = () => {
    if (seconds >= speaker.timingProfile.redBlinkSeconds) {
      return "DISQUALIFIED";
    }
    if (seconds >= speaker.timingProfile.redSeconds) {
      return "RED";
    }
    if (seconds >= speaker.timingProfile.yellowSeconds) {
      return "YELLOW";
    }
    if (seconds >= speaker.timingProfile.greenSeconds) {
      return "GREEN";
    }
    return "READY";
  };

  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsRunning(false);
    setIsPaused(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setSeconds(0);
  };

  const handleSaveAndNext = () => {
    onSaveAndNext(seconds);
  };

  const status = getTimingStatus(seconds, speaker.timingProfile);

  const getSpeechTypeLabel = (type: string) => {
    switch (type) {
      case "PREPARED":
        return "Prepared Speech";
      case "TABLE_TOPIC":
        return "Table Topics";
      case "EVALUATION":
        return "Evaluation";
      default:
        return "Custom";
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen flex flex-col transition-colors duration-300",
        getBackgroundColor()
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="text-center flex-1">
          <p className="text-sm font-medium text-muted-foreground">
            Speaker {speakerNumber} of {totalSpeakers}
          </p>
        </div>
        <div className="w-10" />
      </div>

      {/* Speaker Info */}
      <div className="px-6 py-4 bg-background/80 backdrop-blur-sm">
        <h1 className="text-2xl font-bold text-center mb-1">{speaker.name}</h1>
        <p className="text-center text-muted-foreground">
          {getSpeechTypeLabel(speaker.speechType)} •{" "}
          {formatTime(speaker.timingProfile.greenSeconds)}–
          {formatTime(speaker.timingProfile.redSeconds)}
        </p>
      </div>

      {/* Timer Display */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="text-center mb-8">
          <div className="text-8xl md:text-9xl font-bold font-mono mb-4">
            {formatTime(seconds)}
          </div>
          <div className="text-3xl font-bold tracking-wider">
            {getColorLabel()}
          </div>
        </div>

        {isPaused && (
          <div className="bg-background/90 backdrop-blur-sm rounded-lg p-6 text-center max-w-md">
            <p className="text-lg font-semibold mb-2">Recorded Time</p>
            <p className="text-4xl font-mono font-bold mb-4">
              {formatTime(seconds)}
            </p>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>
                Status:{" "}
                <span
                  className={cn(
                    "font-semibold",
                    status === "WITHIN" && "text-green-600",
                    status === "UNDER" && "text-yellow-600",
                    status === "OVER" && "text-orange-600",
                    status === "DISQUALIFIED" && "text-red-600"
                  )}
                >
                  {status === "WITHIN"
                    ? "Within range"
                    : status === "UNDER"
                    ? "Under time"
                    : status === "OVER"
                    ? "Over time"
                    : "Disqualified"}
                </span>
              </p>
              {status === "DISQUALIFIED" && (
                <p className="text-red-600 font-medium">
                  {seconds < speaker.timingProfile.minSeconds
                    ? `Finished ${formatTime(
                        speaker.timingProfile.minSeconds - seconds
                      )} too early`
                    : `Exceeded max time by ${formatTime(
                        seconds - speaker.timingProfile.redBlinkSeconds
                      )}`}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-6 space-y-3 bg-background/80 backdrop-blur-sm">
        {!isRunning && !isPaused && (
          <Button onClick={handleStart} className="w-full h-16 text-xl" size="lg">
            <Play className="w-6 h-6 mr-2" />
            Start
          </Button>
        )}

        {isRunning && (
          <Button
            onClick={handlePause}
            variant="secondary"
            className="w-full h-16 text-xl"
            size="lg"
          >
            <Pause className="w-6 h-6 mr-2" />
            Pause
          </Button>
        )}

        {isPaused && (
          <>
            <Button
              onClick={handleSaveAndNext}
              className="w-full h-16 text-xl"
              size="lg"
            >
              {speakerNumber === totalSpeakers
                ? "Generate Report (PDF)"
                : "Continue"}
            </Button>
            <Button
              onClick={handleStart}
              variant="outline"
              className="w-full h-12"
            >
              Continue
            </Button>
          </>
        )}

        <Button
          onClick={handleReset}
          variant="outline"
          className="w-full h-12"
          disabled={seconds === 0}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>
    </div>
  );
};
