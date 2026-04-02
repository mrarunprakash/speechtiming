import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, CheckCircle2 } from "lucide-react";
import { Speaker, formatTime } from "@/types/timer";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface TimerReportProps {
  meetingName: string;
  meetingDate: string;
  speakers: Speaker[];
  onStartNew: () => void;
}

export const TimerReport = ({
  meetingName,
  meetingDate,
  speakers,
  onStartNew,
}: TimerReportProps) => {
  const [generated, setGenerated] = useState(false);
  const { toast } = useToast();

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

  const getStatusColors = (status?: string) => {
    switch (status) {
      case "WITHIN": return { border: "border-l-4 border-l-green-500", text: "text-green-600" };
      case "UNDER": return { border: "border-l-4 border-l-yellow-500", text: "text-yellow-600" };
      case "OVER": return { border: "border-l-4 border-l-orange-500", text: "text-orange-600" };
      case "DISQUALIFIED": return { border: "border-l-4 border-l-red-500", text: "text-red-600" };
      default: return { border: "", text: "" };
    }
  };

  const getStatusBadge = (status: string | undefined) => {
    if (!status) return null;

    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      WITHIN: { variant: "default", label: "On Time" },
      UNDER: { variant: "secondary", label: "Under Time" },
      OVER: { variant: "outline", label: "Over Time" },
      DISQUALIFIED: { variant: "destructive", label: "Disqualified" },
    };

    const config = variants[status] || { variant: "outline" as const, label: status };

    return (
      <Badge variant={config.variant} className="ml-2">
        {config.label}
      </Badge>
    );
  };

  const generateReportText = () => {
    const date = new Date(meetingDate).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    let report = `Timer's Report – ${meetingName} (${date})\n\n`;

    speakers.forEach((speaker, index) => {
      const timeRange = `${formatTime(speaker.timingProfile.greenSeconds)}–${formatTime(
        speaker.timingProfile.redSeconds
      )}`;
      const actualTime = speaker.actualSeconds
        ? formatTime(speaker.actualSeconds)
        : "Not timed";

      let statusText = "";
      if (speaker.status === "WITHIN") {
        statusText = `within the ${timeRange} range`;
      } else if (speaker.status === "UNDER") {
        statusText = `under the ${timeRange} range`;
      } else if (speaker.status === "OVER") {
        statusText = `over the ${timeRange} range`;
      } else if (speaker.status === "DISQUALIFIED") {
        const minTime = formatTime(speaker.timingProfile.minSeconds);
        const maxTime = formatTime(speaker.timingProfile.redBlinkSeconds);
        statusText = `disqualified (must be between ${minTime} and ${maxTime})`;
      }

      report += `${index + 1}. ${speaker.name} – ${getSpeechTypeLabel(
        speaker.speechType
      )}\n`;
      report += `   Spoke for ${actualTime}${
        statusText ? ` – ${statusText}` : ""
      }.\n\n`;
    });

    return report;
  };

  const handleGeneratePDF = () => {
    try {
      const doc = new jsPDF();
      const date = new Date(meetingDate).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      // Title
      doc.setFontSize(18);
      doc.text("Timer's Report", 14, 20);
      
      // Meeting details
      doc.setFontSize(12);
      doc.text(meetingName, 14, 30);
      doc.setFontSize(10);
      doc.text(date, 14, 37);

      // Table data
      const tableData = speakers.map((speaker, index) => {
        const targetTime = `${formatTime(speaker.timingProfile.greenSeconds)}–${formatTime(speaker.timingProfile.redSeconds)}`;
        const actualTime = speaker.actualSeconds ? formatTime(speaker.actualSeconds) : "–";
        
        let status = "–";
        if (speaker.status === "WITHIN") status = "✓ Within";
        else if (speaker.status === "UNDER") status = "⚠ Under";
        else if (speaker.status === "OVER") status = "⚠ Over";
        else if (speaker.status === "DISQUALIFIED") status = "✗ Disqualified";

        return [
          (index + 1).toString(),
          speaker.name,
          getSpeechTypeLabel(speaker.speechType),
          targetTime,
          actualTime,
          status,
        ];
      });

      autoTable(doc, {
        startY: 45,
        head: [["#", "Speaker", "Role", "Target Time", "Actual Time", "Status"]],
        body: tableData,
        didParseCell: (data) => {
          if (data.section === 'body' && data.column.index === 5) {
            const speaker = speakers[data.row.index];
            if (speaker.status === "WITHIN") {
              data.cell.styles.fillColor = [34, 197, 94]; // green
              data.cell.styles.textColor = [255, 255, 255];
            } else if (speaker.status === "UNDER") {
              data.cell.styles.fillColor = [234, 179, 8]; // yellow
              data.cell.styles.textColor = [255, 255, 255];
            } else if (speaker.status === "OVER" || speaker.status === "DISQUALIFIED") {
              data.cell.styles.fillColor = [239, 68, 68]; // red
              data.cell.styles.textColor = [255, 255, 255];
            }
          }
        },
        headStyles: {
          fillColor: [59, 130, 246], // blue
          textColor: [255, 255, 255],
        },
      });

      // Save PDF
      const fileName = `timer-report-${new Date(meetingDate).toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
      setGenerated(true);
      toast({
        title: "PDF Generated!",
        description: "The timer report has been downloaded as PDF.",
      });
      setTimeout(() => setGenerated(false), 3000);
    } catch (error) {
      toast({
        title: "Failed to generate PDF",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-full bg-background flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-primary">
                Timer's Report
              </CardTitle>
              <p className="text-muted-foreground">{meetingName}</p>
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

          {(() => {
            const totalTime = speakers.reduce((sum, s) => sum + (s.actualSeconds || 0), 0);
            const withinCount = speakers.filter(s => s.status === "WITHIN").length;
            const onTimePct = speakers.length > 0 ? Math.round((withinCount / speakers.length) * 100) : 0;
            return (
              <div className="flex justify-around items-start py-4">
                <div className="flex flex-col items-center">
                  <span className="font-mono text-3xl font-bold">{speakers.length}</span>
                  <span className="text-xs uppercase tracking-widest text-muted-foreground mt-1">Speakers</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-mono text-3xl font-bold">{formatTime(totalTime)}</span>
                  <span className="text-xs uppercase tracking-widest text-muted-foreground mt-1">Total Time</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-mono text-3xl font-bold">{onTimePct}%</span>
                  <span className="text-xs uppercase tracking-widest text-muted-foreground mt-1">On Time</span>
                </div>
              </div>
            );
          })()}

          <div className="space-y-0">
            {speakers.map((speaker, index) => {
              const borderColor = speaker.status === "WITHIN" ? "border-l-green-500"
                : speaker.status === "UNDER" ? "border-l-amber-500"
                : speaker.status === "OVER" || speaker.status === "DISQUALIFIED" ? "border-l-red-500"
                : "border-l-transparent";
              const rowBg = index % 2 === 0 ? "bg-[#ffffff04]" : "bg-transparent";
              return (
                <div key={speaker.id}>
                  <div className={`border-l-[3px] ${borderColor} ${rowBg} px-4 py-3 flex items-center gap-3`}>
                    <div className="flex-1 text-left">
                      <h3 className="text-lg font-bold">{speaker.name}</h3>
                    </div>
                    <div className="flex-1 text-center">
                      <span className="text-xs uppercase tracking-widest text-muted-foreground">
                        {getSpeechTypeLabel(speaker.speechType)}
                      </span>
                    </div>
                    <div className="flex-1 text-right">
                      <span className={`font-mono text-xl font-bold ${getStatusColors(speaker.status).text}`}>
                        {speaker.actualSeconds ? formatTime(speaker.actualSeconds) : "–"}
                      </span>
                    </div>
                  </div>
                  {speaker.status === "DISQUALIFIED" && (
                    <div className={`${rowBg} px-4 pb-2 ml-[3px] border-l-[3px] border-l-red-500`}>
                      <p className="text-sm text-destructive font-medium">
                        {speaker.actualSeconds && speaker.actualSeconds < speaker.timingProfile.minSeconds
                          ? `Finished ${formatTime(speaker.timingProfile.minSeconds - speaker.actualSeconds)} too early (min: ${formatTime(speaker.timingProfile.minSeconds)})`
                          : speaker.actualSeconds && `Exceeded max time by ${formatTime(speaker.actualSeconds - speaker.timingProfile.redBlinkSeconds)} (max: ${formatTime(speaker.timingProfile.redBlinkSeconds)})`}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="shrink-0 p-4 bg-background border-t border-[#ffffff0d] space-y-3">
        <div className="max-w-2xl mx-auto space-y-3">
          <Button
            onClick={handleGeneratePDF}
            className="w-full h-14 text-lg"
            size="lg"
          >
            {generated ? (
              <>
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Downloaded!
              </>
            ) : (
              <>
                <Download className="w-5 h-5 mr-2" />
                Download PDF Report
              </>
            )}
          </Button>
          <Button
            onClick={onStartNew}
            variant="outline"
            className="w-full h-12"
            size="lg"
          >
            Start New Meeting
          </Button>
        </div>
      </div>
    </div>
  );
};
