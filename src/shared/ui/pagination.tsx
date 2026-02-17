import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "./button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

interface PaginationProps {
  total: number;
  skip: number;
  limit: number;
  onChangeLimit: (value: number) => void;
  onPrev: () => void;
  onNext: () => void;
}

export function Pagination({ total, skip, limit, onChangeLimit, onPrev, onNext }: Readonly<PaginationProps>) {
  const currentPage = Math.floor(skip / limit) + 1;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <nav aria-label="페이지네이션" className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>페이지당</span>
        <Select value={String(limit)} onValueChange={(value) => onChangeLimit(Number(value))}>
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="30">30</SelectItem>
          </SelectContent>
        </Select>
        <span>건</span>
      </div>

      <div className="flex items-center gap-2">
        <span aria-live="polite" aria-atomic="true" className="text-sm text-muted-foreground">
          {currentPage} / {totalPages}
        </span>
        <div className="flex items-center gap-1">
          <Button
            aria-label="이전 페이지"
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={skip === 0}
            onClick={onPrev}
          >
            <ChevronLeft aria-hidden="true" className="h-4 w-4" />
          </Button>
          <Button
            aria-label="다음 페이지"
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={skip + limit >= total}
            onClick={onNext}
          >
            <ChevronRight aria-hidden="true" className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
