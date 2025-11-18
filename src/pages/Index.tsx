import { useState } from "react";
import { MeetingSetup } from "@/components/MeetingSetup";
import { SpeakersList } from "@/components/SpeakersList";
import { TimerView } from "@/components/TimerView";
import { TimerReport } from "@/components/TimerReport";
import { Meeting, Speaker, getTimingStatus } from "@/types/timer";

type AppState = "setup" | "speakers" | "timing" | "report";

const Index = () => {
  const [appState, setAppState] = useState<AppState>("setup");
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [currentSpeakerIndex, setCurrentSpeakerIndex] = useState(0);

  const handleStartMeeting = (meetingName: string, meetingDate: string) => {
    setMeeting({
      id: crypto.randomUUID(),
      name: meetingName,
      date: meetingDate,
      speakers: [],
    });
    setAppState("speakers");
  };

  const handleAddSpeaker = (speaker: Speaker) => {
    if (!meeting) return;
    setMeeting({
      ...meeting,
      speakers: [...meeting.speakers, speaker],
    });
  };

  const handleEditSpeaker = (updatedSpeaker: Speaker) => {
    if (!meeting) return;
    setMeeting({
      ...meeting,
      speakers: meeting.speakers.map((s) =>
        s.id === updatedSpeaker.id ? updatedSpeaker : s
      ),
    });
  };

  const handleDeleteSpeaker = (id: string) => {
    if (!meeting) return;
    setMeeting({
      ...meeting,
      speakers: meeting.speakers.filter((s) => s.id !== id),
    });
  };

  const handleStartTiming = () => {
    setCurrentSpeakerIndex(0);
    setAppState("timing");
  };

  const handleSaveAndNext = (actualSeconds: number) => {
    if (!meeting) return;

    const currentSpeaker = meeting.speakers[currentSpeakerIndex];
    const status = getTimingStatus(actualSeconds, currentSpeaker.timingProfile);

    const updatedSpeakers = [...meeting.speakers];
    updatedSpeakers[currentSpeakerIndex] = {
      ...currentSpeaker,
      actualSeconds,
      status,
    };

    setMeeting({
      ...meeting,
      speakers: updatedSpeakers,
    });

    if (currentSpeakerIndex < meeting.speakers.length - 1) {
      setCurrentSpeakerIndex(currentSpeakerIndex + 1);
    } else {
      setAppState("report");
    }
  };


  const handleBackToSpeakers = () => {
    setAppState("speakers");
  };

  const handleStartNew = () => {
    setMeeting(null);
    setCurrentSpeakerIndex(0);
    setAppState("setup");
  };

  if (appState === "setup") {
    return <MeetingSetup onStart={handleStartMeeting} />;
  }

  if (appState === "speakers" && meeting) {
    return (
      <SpeakersList
        meetingName={meeting.name}
        meetingDate={meeting.date}
        speakers={meeting.speakers}
        onAddSpeaker={handleAddSpeaker}
        onEditSpeaker={handleEditSpeaker}
        onDeleteSpeaker={handleDeleteSpeaker}
        onStartTiming={handleStartTiming}
      />
    );
  }

  if (appState === "timing" && meeting) {
    const currentSpeaker = meeting.speakers[currentSpeakerIndex];
    return (
      <TimerView
        speaker={currentSpeaker}
        speakerNumber={currentSpeakerIndex + 1}
        totalSpeakers={meeting.speakers.length}
        onBack={handleBackToSpeakers}
        onSaveAndNext={handleSaveAndNext}
      />
    );
  }

  if (appState === "report" && meeting) {
    return (
      <TimerReport
        meetingName={meeting.name}
        meetingDate={meeting.date}
        speakers={meeting.speakers}
        onStartNew={handleStartNew}
      />
    );
  }

  return null;
};

export default Index;
