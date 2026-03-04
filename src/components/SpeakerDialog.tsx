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

  // Local string state for custom inputs so users can freely type/erase
  const toMin = (s: number) => {
    const val = s / 60;
    return val % 1 === 0 ? val.toString() : val.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
  };
  const [customInputs, setCustomInputs] = useState({
    min: toMin(300),
    green: toMin(300),
    yellow: toMin(360),
    red: toMin(420),
    redBlink: toMin(450),
  });

  useEffect(() => {
    if (speaker) {
      setName(speaker.name);
      setSpeechType(speaker.speechType);
      setCustomProfile(speaker.timingProfile);
      setCustomInputs({
        min: toMin(speaker.timingProfile.minSeconds),
        green: toMin(speaker.timingProfile.greenSeconds),
        yellow: toMin(speaker.timingProfile.yellowSeconds),
        red: toMin(speaker.timingProfile.redSeconds),
        redBlink: toMin(speaker.timingProfile.redBlinkSeconds),
      });
    } else {
      setName("");
      setSpeechType("PREPARED");
      const def = TIMING_PROFILES.PREPARED;
      setCustomProfile(def);
      setCustomInputs({
        min: toMin(def.minSeconds),
        green: toMin(def.greenSeconds),
        yellow: toMin(def.yellowSeconds),
        red: toMin(def.redSeconds),
        redBlink: toMin(def.redBlinkSeconds),
      });
    }
  }, [speaker, open]);

  const handleCustomInput = (field: string, profileKey: string, val: string) => {
    setCustomInputs((prev) => ({ ...prev, [field]: val }));
    const num = parseFloat(val);
    if (!isNaN(num) && num >= 0) {
      setCustomProfile((prev) => ({ ...prev, [profileKey]: Math.round(num * 60) }));
    }
  };

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
                Customize timing thresholds (in minutes)
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="min">Min Time</Label>
                  <Input
                    id="min"
                    type="number"
                    step="0.5"
                    min="0"
                    value={customInputs.min}
                    onChange={(e) => handleCustomInput("min", "minSeconds", e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="green">Green</Label>
                  <Input
                    id="green"
                    type="number"
                    step="0.5"
                    min="0"
                    value={customInputs.green}
                    onChange={(e) => handleCustomInput("green", "greenSeconds", e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="yellow">Yellow</Label>
                  <Input
                    id="yellow"
                    type="number"
                    step="0.5"
                    min="0"
                    value={customInputs.yellow}
                    onChange={(e) => handleCustomInput("yellow", "yellowSeconds", e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="red">Red</Label>
                  <Input
                    id="red"
                    type="number"
                    step="0.5"
                    min="0"
                    value={customInputs.red}
                    onChange={(e) => handleCustomInput("red", "redSeconds", e.target.value)}
                  />
                </div>
                <div className="space-y-1 col-span-2">
                  <Label htmlFor="redBlink">Max Time</Label>
                  <Input
                    id="redBlink"
                    type="number"
                    step="0.5"
                    min="0"
                    value={customInputs.redBlink}
                    onChange={(e) => handleCustomInput("redBlink", "redBlinkSeconds", e.target.value)}
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
