import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GRADE_OPTIONS } from "@/lib/grade";

interface ProfileStepProps {
  defaultName: string;
  defaultDepartment?: string;
  defaultStudentId?: string;
  defaultPhone?: string;
  defaultGrade?: string;
  onBack: () => void;
  onComplete: (name: string, department: string, studentId: string, phone: string, grade: string) => void;
}

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length <= 4) return digits;
  return digits.replace(/(\d)(?=(\d{4})+$)/g, "$1-");
}

export function ProfileStep({ defaultName, defaultDepartment, defaultStudentId, defaultPhone, defaultGrade, onBack, onComplete }: ProfileStepProps) {
  const [name, setName] = useState(defaultName);
  const [department, setDepartment] = useState(defaultDepartment ?? "");
  const [studentId, setStudentId] = useState(defaultStudentId ?? "");
  const [phone, setPhone] = useState(defaultPhone ?? "");
  const [grade, setGrade] = useState(defaultGrade ?? "");

  return (
    <div className="space-y-4">
      <p className="text-center text-sm text-muted-foreground">
        개인 정보를 입력해주세요.
      </p>
      <div className="space-y-2">
        <Label htmlFor="name">이름</Label>
        <Input
          id="name"
          placeholder="홍길동"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="department">학부(학과)</Label>
        <Input
          id="department"
          placeholder="컴퓨터공학부"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="student-id">학번</Label>
        <Input
          id="student-id"
          placeholder="2024136000"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value.replace(/\D/g, ""))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">전화번호</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="01012345678"
          value={phone}
          onChange={(e) => setPhone(formatPhone(e.target.value))}
        />
      </div>
      <div className="space-y-2">
        <Label>학년</Label>
        <Select value={grade} onValueChange={(v) => setGrade(v ?? "")}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="학년 선택">
              {GRADE_OPTIONS.find((o) => o.value === grade)?.label ?? "학년 선택"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {GRADE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        className="w-full"
        onClick={() => onComplete(name, department, studentId, phone, grade)}
        disabled={!name.trim() || !department.trim() || !studentId.trim() || phone.replace(/\D/g, "").length < 7 || !grade}
      >
        다음
      </Button>
      <Button variant="ghost" className="w-full gap-2" onClick={onBack}>
        <ArrowLeft className="h-4 w-4" />
        이전 단계
      </Button>
    </div>
  );
}
