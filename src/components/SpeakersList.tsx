import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Clock, Pause, GripVertical } from "lucide-react";
import { Speaker, formatTime } from "@/types/timer";
import { SpeakerDialog } from "./SpeakerDialog";

interface SpeakersListProps {
  meetingName: string;
  meetingDate: string;
  speakers: Speaker[];
  onAddSpeaker: (speaker: Speaker) => void;
  onEditSpeaker: (speaker: Speaker) => void;
  onDeleteSpeaker: (id: string) => void;
  onReorderSpeakers: (speakers: Speaker[]) => void;
  onStartTiming: () => void;
  pausedTimers?: Record<number, number>;
}

export const SpeakersList = ({
  meetingName,
  meetingDate,
  speakers,
  onAddSpeaker,
  onEditSpeaker,
  onDeleteSpeaker,
  onReorderSpeakers,
  onStartTiming,
  pausedTimers = {},
}: SpeakersListProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSpeaker, setEditingSpeaker] = useState<Speaker | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragNodeRef = useRef<HTMLDivElement | null>(null);

  const handleAddClick = () => {
    setEditingSpeaker(null);
    setDialogOpen(true);
  };

  const handleEditClick = (speaker: Speaker) => {
    setEditingSpeaker(speaker);
    setDialogOpen(true);
  };

  const handleSaveSpeaker = (speaker: Speaker) => {
    if (editingSpeaker) {
      onEditSpeaker(speaker);
    } else {
      onAddSpeaker(speaker);
    }
    setDialogOpen(false);
  };

  const handleDragStart = (index: number, e: React.DragEvent<HTMLDivElement>) => {
    setDragIndex(index);
    dragNodeRef.current = e.currentTarget;
    e.dataTransfer.effectAllowed = "move";
    // Make drag image slightly transparent
    requestAnimationFrame(() => {
      if (dragNodeRef.current) {
        dragNodeRef.current.style.opacity = "0.4";
      }
    });
  };

  const handleDragOver = (index: number, e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragIndex === null || dragIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    if (dragNodeRef.current) {
      dragNodeRef.current.style.opacity = "1";
    }
    if (dragIndex !== null && dragOverIndex !== null && dragIndex !== dragOverIndex) {
      const reordered = [...speakers];
      const [moved] = reordered.splice(dragIndex, 1);
      reordered.splice(dragOverIndex, 0, moved);
      onReorderSpeakers(reordered);
    }
    setDragIndex(null);
    setDragOverIndex(null);
    dragNodeRef.current = null;
  };

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

  const getTimeRangeLabel = (profile: any) => {
    const min = formatTime(profile.minSeconds);
    const max = formatTime(profile.redSeconds);
    return `${min}–${max}`;
  };

  return (
    <div className="h-full bg-background flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl font-bold text-primary">
                {meetingName}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {new Date(meetingDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </CardHeader>
          </Card>

          <div className="space-y-3">
            {speakers.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Clock className="w-12 h-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-2">No speakers added yet</p>
                  <p className="text-sm text-muted-foreground">
                    Add speakers to start timing
                  </p>
                </CardContent>
              </Card>
            ) : (
              speakers.map((speaker, index) => (
                <div
                  key={speaker.id}
                  draggable
                  onDragStart={(e) => handleDragStart(index, e)}
                  onDragOver={(e) => handleDragOver(index, e)}
                  onDragEnd={handleDragEnd}
                  className={`transition-all duration-200 ${
                    dragOverIndex === index && dragIndex !== index
                      ? "border-t-2 border-primary pt-1"
                      : ""
                  }`}
                >
                  <Card className={`hover:shadow-md transition-shadow ${
                    dragIndex === index ? "opacity-40" : ""
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground shrink-0 pt-1">
                          <GripVertical className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="font-mono">
                              #{index + 1}
                            </Badge>
                            <h3 className="font-semibold text-lg truncate">
                              {speaker.name}
                            </h3>
                            {pausedTimers[index] !== undefined && (
                              <Badge variant="secondary" className="text-xs flex items-center gap-1">
                                <Pause className="w-3 h-3" />
                                {formatTime(pausedTimers[index])}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span>{getSpeechTypeLabel(speaker.speechType)}</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {getTimeRangeLabel(speaker.timingProfile)}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(speaker)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDeleteSpeaker(speaker.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))
            )}
          </div>

          <Button
            onClick={handleAddClick}
            variant="outline"
            className="w-full h-14 text-base"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Speaker
          </Button>
        </div>
      </div>

      <div className="shrink-0 p-4 bg-background border-t">
        <div className="max-w-2xl mx-auto">
          <Button
            onClick={onStartTiming}
            disabled={speakers.length === 0}
            className="w-full h-14 text-lg font-semibold"
            size="lg"
          >
            {Object.keys(pausedTimers).length > 0 ? "Resume" : "Start"} Timing ({speakers.length} {speakers.length === 1 ? "speaker" : "speakers"})
          </Button>
        </div>
      </div>

      <SpeakerDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        speaker={editingSpeaker}
        onSave={handleSaveSpeaker}
      />
    </div>
  );
};
