import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import type { FormQuestion, AnswerInput } from "@/types/application";

interface DynamicFormProps {
  questions: FormQuestion[];
  onSubmit: (answers: AnswerInput[]) => void;
  isPending: boolean;
  submitLabel?: string;
}

export function DynamicForm({
  questions,
  onSubmit,
  isPending,
  submitLabel = "제출",
}: DynamicFormProps) {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>(() => {
    const init: Record<string, string | string[]> = {};
    for (const q of questions) {
      init[q.id] = q.type === "checkbox" ? [] : "";
    }
    return init;
  });

  const sorted = [...questions].sort((a, b) => a.sortOrder - b.sortOrder);

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
    for (const q of sorted) {
      if (!q.required) continue;
      const val = answers[q.id];
      if (Array.isArray(val) ? val.length === 0 : !val) return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result: AnswerInput[] = sorted.map((q) => ({
      questionId: q.id,
      value: Array.isArray(answers[q.id])
        ? (answers[q.id] as string[]).join(",")
        : (answers[q.id] as string),
    }));
    onSubmit(result);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
