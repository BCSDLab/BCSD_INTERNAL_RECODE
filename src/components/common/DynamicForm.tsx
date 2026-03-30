import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FormQuestion, ApplicationAnswer } from "@/types/application";

interface FixedFields {
  name: string;
  email: string;
  schoolEmail: string;
  track: string;
}

interface DynamicFormProps {
  questions: FormQuestion[];
  fixedFields: FixedFields;
  trackOptions: string[];
  onSubmit: (answers: ApplicationAnswer[], track: string) => void;
  isPending: boolean;
  submitLabel?: string;
}

export function DynamicForm({
  questions,
  fixedFields,
  trackOptions,
  onSubmit,
  isPending,
  submitLabel = "제출",
}: DynamicFormProps) {
  const [track, setTrack] = useState(fixedFields.track);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>(() => {
    const init: Record<string, string | string[]> = {};
    for (const q of questions) {
      init[q.id] = q.type === "checkbox" ? [] : "";
    }
    return init;
  });

  const sorted = [...questions].sort((a, b) => a.order - b.order);

  const setAnswer = (questionId: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const toggleCheckbox = (questionId: string, option: string) => {
    setAnswers((prev) => {
      const current = prev[questionId] as string[];
      const next = current.includes(option)
        ? current.filter((v) => v !== option)
        : [...current, option];
      return { ...prev, [questionId]: next };
    });
  };

  const isValid = () => {
    if (!track) return false;
    for (const q of sorted) {
      if (!q.required) continue;
      const val = answers[q.id];
      if (Array.isArray(val) ? val.length === 0 : !val) return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result: ApplicationAnswer[] = sorted.map((q) => ({
      questionId: q.id,
      value: answers[q.id],
    }));
    onSubmit(result, track);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4 rounded-lg border p-4">
        <h3 className="text-sm font-medium text-muted-foreground">기본 정보</h3>
        <div className="space-y-2">
          <Label>이름</Label>
          <Input value={fixedFields.name} disabled className="bg-muted" />
        </div>
        <div className="space-y-2">
          <Label>이메일</Label>
          <Input value={fixedFields.email} disabled className="bg-muted" />
        </div>
        <div className="space-y-2">
          <Label>학교 이메일</Label>
          <Input value={fixedFields.schoolEmail} disabled className="bg-muted" />
        </div>
        <div className="space-y-2">
          <Label>희망 트랙</Label>
          <Select value={track} onValueChange={(v) => setTrack(v ?? "")}>
            <SelectTrigger>
              <SelectValue placeholder="트랙 선택" />
            </SelectTrigger>
            <SelectContent>
              {trackOptions.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {sorted.map((q) => (
        <div key={q.id} className="space-y-2">
          <Label>
            {q.label}
            {q.required && <span className="ml-1 text-destructive">*</span>}
          </Label>

          {q.type === "short_text" && (
            <Input
              value={answers[q.id] as string}
              onChange={(e) => setAnswer(q.id, e.target.value)}
            />
          )}

          {q.type === "long_text" && (
            <Textarea
              value={answers[q.id] as string}
              onChange={(e) => setAnswer(q.id, e.target.value)}
              rows={4}
            />
          )}

          {q.type === "multiple_choice" && q.options && (
            <RadioGroup
              value={answers[q.id] as string}
              onValueChange={(v) => setAnswer(q.id, v)}
            >
              {q.options.map((opt) => (
                <div key={opt} className="flex items-center space-x-2">
                  <RadioGroupItem value={opt} id={`${q.id}-${opt}`} />
                  <Label htmlFor={`${q.id}-${opt}`} className="cursor-pointer font-normal">
                    {opt}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {q.type === "checkbox" && q.options && (
            <div className="space-y-2">
              {q.options.map((opt) => (
                <label key={opt} className="flex cursor-pointer items-center gap-2">
                  <Checkbox
                    checked={(answers[q.id] as string[]).includes(opt)}
                    onCheckedChange={() => toggleCheckbox(q.id, opt)}
                  />
                  <span className="text-sm">{opt}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      ))}

      <Button type="submit" className="w-full" disabled={!isValid() || isPending}>
        {isPending ? "제출 중..." : submitLabel}
      </Button>
    </form>
  );
}
