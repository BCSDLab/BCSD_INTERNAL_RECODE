import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useMemberFilters } from "@/hooks/use-members";

interface TrackStepProps {
  onBack: () => void;
  onComplete: (track: string) => void;
  isPending: boolean;
}

export function TrackStep({ onBack, onComplete, isPending }: TrackStepProps) {
  const [track, setTrack] = useState("");
  const { data, isLoading, isError } = useMemberFilters();
  const tracks = data?.tracks;

  return (
    <div className="space-y-4">
      <p className="text-center text-sm text-muted-foreground">
        소속 트랙을 선택해주세요.
      </p>

      {isLoading && (
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-full" />
          ))}
        </div>
      )}

      {isError && (
        <Alert variant="destructive">
          <AlertDescription>트랙 목록을 불러오지 못했습니다.</AlertDescription>
        </Alert>
      )}

      {tracks && (
        <RadioGroup value={track} onValueChange={setTrack} className="grid grid-cols-2 gap-3">
          {tracks.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={option} />
              <Label htmlFor={option} className="cursor-pointer">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      )}

      <Button
        className="w-full"
        onClick={() => onComplete(track)}
        disabled={!track || isPending || isLoading}
      >
        {isPending ? "가입 중..." : "가입하기"}
      </Button>

      <Button variant="ghost" className="w-full gap-2" onClick={onBack}>
        <ArrowLeft className="h-4 w-4" />
        이전 단계
      </Button>
    </div>
  );
}
