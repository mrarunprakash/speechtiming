import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Pause, RotateCcw, Square } from "lucide-react";
import { Speaker, formatTime, getTimingStatus } from "@/types/timer";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface TimerViewProps {
  speaker: Speaker;
  speakerNumber: number;
  totalSpeakers: number;
  onBack: () => void;
  onSaveAndNext: (actualSeconds: number) => void;
  initialSeconds?: number;
  onPauseAndBack?: (seconds: number) => void;
}

export const TimerView = ({
  speaker,
  speakerNumber,
  totalSpeakers,
  onBack,
  onSaveAndNext,
  initialSeconds = 0,
  onPauseAndBack,
}: TimerViewProps) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(initialSeconds > 0);
  const [isStopped, setIsStopped] = useState(false);
  const [isBlink, setIsBlink] = useState(false);
  const [showBackDialog, setShowBackDialog] = useState(false);
  const wasRunningRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const blinkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
    setIsStopped(false);
  };

  const handlePause = () => {
    setIsRunning(false);
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsPaused(false);
    setIsStopped(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setIsStopped(false);
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

  const getGlowColor = () => {
    if (seconds >= speaker.timingProfile.redSeconds) return "#ef4444";
    if (seconds >= speaker.timingProfile.yellowSeconds) return "#eab308";
    if (seconds >= speaker.timingProfile.greenSeconds) return "#22c55e";
    return "transparent";
  };

  return (
    <div
      className={cn(
        "h-full flex flex-col transition-colors duration-300 overflow-hidden",
        getBackgroundColor()
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm">
        <Button variant="ghost" size="icon" onClick={() => {
          if (seconds > 0) {
            wasRunningRef.current = isRunning;
            setIsRunning(false);
            setShowBackDialog(true);
          } else {
            onBack();
          }
        }}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="text-center flex-1">
          <p className="text-sm font-medium text-muted-foreground">
            Speaker {speakerNumber} of {totalSpeakers}
          </p>
        </div>
        <div className="w-10" />
      </div>

      {/* Timer Display */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative">
        {/* Radial glow */}
        <div
          className="absolute inset-0 transition-all duration-[800ms] ease-in-out pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${getGlowColor()}26 0%, transparent 70%)`,
            filter: 'blur(80px)',
          }}
        />

        {/* Speaker name */}
        <h1 className="text-xs uppercase tracking-[0.25em] text-muted-foreground font-medium mb-2 relative z-10">
          {speaker.name} • {getSpeechTypeLabel(speaker.speechType)} • {formatTime(speaker.timingProfile.greenSeconds)}–{formatTime(speaker.timingProfile.redSeconds)}
        </h1>

        <div className="text-center relative z-10">
          <div className="text-[28vw] md:text-[18vw] font-bold font-mono leading-none">
            {formatTime(seconds)}
          </div>
          <div className="text-sm uppercase tracking-[0.2em] text-muted-foreground mt-2">
            {getColorLabel()}
          </div>
        </div>

        {isStopped && (
          <div className="bg-[#ffffff08] backdrop-blur-sm rounded-2xl p-6 text-center max-w-md animate-scale-in">
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
        {!isRunning && !isPaused && !isStopped && (
          <Button onClick={handleStart} className="w-full h-16 text-xl animate-fade-in" size="lg">
            <Play className="w-6 h-6 mr-2" />
            Start
          </Button>
        )}

        {isRunning && (
          <Button
            onClick={handlePause}
            variant="secondary"
            className="w-full h-16 text-xl animate-fade-in"
            size="lg"
          >
            <Pause className="w-6 h-6 mr-2" />
            Pause
          </Button>
        )}

        {isPaused && (
          <div className="space-y-3 animate-fade-in">
            <Button onClick={handleResume} className="w-full h-16 text-xl" size="lg">
              <Play className="w-6 h-6 mr-2" />
              Resume
            </Button>
            <Button
              onClick={handleStop}
              variant="destructive"
              className="w-full h-16 text-xl"
              size="lg"
            >
              <Square className="w-6 h-6 mr-2" />
              Stop Timing
            </Button>
          </div>
        )}

        {isStopped && (
          <Button
            onClick={handleSaveAndNext}
            className="w-full h-16 text-xl animate-fade-in"
            size="lg"
          >
            {speakerNumber === totalSpeakers
              ? "Generate Report (PDF)"
              : "Continue"}
          </Button>
        )}

        {(isPaused || isStopped) && (
          <Button
            onClick={handleReset}
            variant="outline"
            className="w-full h-12 animate-fade-in"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        )}

        {!isPaused && !isStopped && (
          <Button
            onClick={handleReset}
            variant="outline"
            className="w-full h-12"
            disabled={seconds === 0}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        )}
      </div>

      <AlertDialog open={showBackDialog} onOpenChange={setShowBackDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Timer is running</AlertDialogTitle>
            <AlertDialogDescription>
              You have {formatTime(seconds)} recorded. What would you like to do?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
            <AlertDialogAction onClick={() => {
              onPauseAndBack?.(seconds);
            }}>
              Pause & Go Back
            </AlertDialogAction>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => {
              onBack();
            }}>
              Stop & Discard
            </AlertDialogAction>
            <AlertDialogCancel onClick={() => {
              if (wasRunningRef.current) setIsRunning(true);
            }}>
              Cancel
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
