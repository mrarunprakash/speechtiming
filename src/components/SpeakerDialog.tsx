import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Speaker, SpeechType, TIMING_PROFILES, formatTime } from "@/types/timer";

interface SpeakerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  speaker: Speaker | null;
  onSave: (speaker: Speaker) => void;
}

export const SpeakerDialog = ({
  open,
  onOpenChange,
  speaker,
  onSave,
}: SpeakerDialogProps) => {
  const [name, setName] = useState("");
  const [speechType, setSpeechType] = useState<SpeechType>("PREPARED");
  const [customProfile, setCustomProfile] = useState({
    minSeconds: 300,
    greenSeconds: 300,
    yellowSeconds: 360,
    redSeconds: 420,
    redBlinkSeconds: 450,
  });

  useEffect(() => {
    if (speaker) {
      setName(speaker.name);
      setSpeechType(speaker.speechType);
      setCustomProfile(speaker.timingProfile);
    } else {
      setName("");
      setSpeechType("PREPARED");
      setCustomProfile(TIMING_PROFILES.PREPARED);
    }
  }, [speaker, open]);

  const handleSave = () => {
    const profile =
      speechType === "CUSTOM" ? customProfile : TIMING_PROFILES[speechType];

    const newSpeaker: Speaker = {
      id: speaker?.id || crypto.randomUUID(),
      name,
      speechType,
      timingProfile: profile,
    };

    onSave(newSpeaker);
  };

  const currentProfile =
    speechType === "CUSTOM" ? customProfile : TIMING_PROFILES[speechType];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {speaker ? "Edit Speaker" : "Add Speaker"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Speaker Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter speaker name"
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="speech-type">Speech Type</Label>
            <Select
              value={speechType}
              onValueChange={(value) => setSpeechType(value as SpeechType)}
            >
              <SelectTrigger id="speech-type" className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PREPARED">Prepared Speech</SelectItem>
                <SelectItem value="TABLE_TOPIC">Table Topics</SelectItem>
                <SelectItem value="EVALUATION">Evaluation</SelectItem>
                <SelectItem value="CUSTOM">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-muted rounded-lg p-4 space-y-2">
            <p className="text-sm font-medium">Timing Profile</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Min Time:</span>{" "}
                <span className="font-mono">{formatTime(currentProfile.minSeconds)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Green:</span>{" "}
                <span className="font-mono">{formatTime(currentProfile.greenSeconds)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Yellow:</span>{" "}
                <span className="font-mono">{formatTime(currentProfile.yellowSeconds)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Red:</span>{" "}
                <span className="font-mono">{formatTime(currentProfile.redSeconds)}</span>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Max Time:</span>{" "}
                <span className="font-mono">{formatTime(currentProfile.redBlinkSeconds)}</span>
              </div>
            </div>
          </div>

          {speechType === "CUSTOM" && (
            <div className="space-y-3 pt-2">
              <p className="text-sm text-muted-foreground">
                Customize timing thresholds (in seconds)
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="min">Min Time</Label>
                  <Input
                    id="min"
                    type="number"
                    value={customProfile.minSeconds}
                    onChange={(e) =>
                      setCustomProfile({
                        ...customProfile,
                        minSeconds: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="green">Green</Label>
                  <Input
                    id="green"
                    type="number"
                    value={customProfile.greenSeconds}
                    onChange={(e) =>
                      setCustomProfile({
                        ...customProfile,
                        greenSeconds: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="yellow">Yellow</Label>
                  <Input
                    id="yellow"
                    type="number"
                    value={customProfile.yellowSeconds}
                    onChange={(e) =>
                      setCustomProfile({
                        ...customProfile,
                        yellowSeconds: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="red">Red</Label>
                  <Input
                    id="red"
                    type="number"
                    value={customProfile.redSeconds}
                    onChange={(e) =>
                      setCustomProfile({
                        ...customProfile,
                        redSeconds: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className="space-y-1 col-span-2">
                  <Label htmlFor="redBlink">Max Time</Label>
                  <Input
                    id="redBlink"
                    type="number"
                    value={customProfile.redBlinkSeconds}
                    onChange={(e) =>
                      setCustomProfile({
                        ...customProfile,
                        redBlinkSeconds: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            {speaker ? "Update" : "Add"} Speaker
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
