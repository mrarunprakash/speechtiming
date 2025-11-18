import { useState } from "react";
import { Link } from "react-router-dom";
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

  const renderContent = () => {
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
          key={currentSpeakerIndex}
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

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div className="text-sm font-semibold tracking-tight">
            Toastmasters Timer
          </div>
          <Link
            to="/faq"
            className="text-sm font-medium text-foreground/70 hover:text-foreground hover:underline"
          >
            FAQ
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {renderContent()}
      </main>

      <footer className="border-t bg-card/80 backdrop-blur-sm px-4 py-3 text-center text-xs text-muted-foreground">
        Created by{" "}
        <a
          href="https://www.linkedin.com/in/arunprakashmr/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary hover:underline"
        >
          Arun Prakash
        </a>
      </footer>
    </div>
  );
};

export default Index;
