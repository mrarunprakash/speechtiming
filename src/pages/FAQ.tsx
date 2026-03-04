import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const FAQ = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-sm font-semibold tracking-tight">FAQ</h1>
          <div className="w-20" /> {/* Spacer for center alignment */}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">What is this timer for?</h2>
            <p className="text-muted-foreground">
              This is a speech timer designed to help track speaker timing
              during meetings. It supports multiple timing profiles (green, yellow, red zones)
              and generates detailed reports.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">How do timing profiles work?</h2>
            <p className="text-muted-foreground">
              Each speaker has a timing profile with three thresholds:
            </p>
            <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
              <li><strong>Green:</strong> Timer background turns green when this time is reached</li>
              <li><strong>Yellow:</strong> Background turns yellow as a warning</li>
              <li><strong>Red:</strong> Background turns red when time limit is reached</li>
              <li><strong>Blinking Red:</strong> Starts blinking when speaker exceeds the red threshold</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Can I edit speakers after starting?</h2>
            <p className="text-muted-foreground">
              Yes! You can go back to the speakers list at any time using the Back button
              during timing. You can add, edit, or remove speakers before continuing.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">How does the PDF report work?</h2>
            <p className="text-muted-foreground">
              After timing all speakers, you'll see a "Generate Report (PDF)" button.
              The report includes all speakers with color-coded status (within time, under time, or over time)
              and can be downloaded for your records.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">What if I need to reset a speaker's time?</h2>
            <p className="text-muted-foreground">
              While timing, you can use the Reset button to restart the current speaker's timer
              without affecting other speakers or moving to the next person.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FAQ;
