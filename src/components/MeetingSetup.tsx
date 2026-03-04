import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface MeetingSetupProps {
  onStart: (meetingName: string, meetingDate: string) => void;
}

export const MeetingSetup = ({ onStart }: MeetingSetupProps) => {
  const [meetingName, setMeetingName] = useState("Club Meeting");
  const [meetingDate, setMeetingDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const handleStart = () => {
    onStart(meetingName, meetingDate);
  };

  return (
    <div className="h-full bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Speech Timer
          </CardTitle>
          <CardDescription className="text-base">
            Record timing & generate reports for Toastmasters meetings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="meeting-name">Meeting Name</Label>
            <Input
              id="meeting-name"
              value={meetingName}
              onChange={(e) => setMeetingName(e.target.value)}
              placeholder="Club Meeting"
              className="text-base h-12"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="meeting-date">Date</Label>
            <Input
              id="meeting-date"
              type="date"
              value={meetingDate}
              onChange={(e) => setMeetingDate(e.target.value)}
              className="text-base h-12"
            />
          </div>
          <Button
            onClick={handleStart}
            className="w-full h-14 text-lg font-semibold"
            size="lg"
          >
            Start Timing Session
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
