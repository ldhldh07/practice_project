import { Search } from "lucide-react";

import { Input } from "@/shared/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";

import type { EmployeeSortBy, SortOrder } from "../model/employee.types";

type EmployeeFilterProps = {
  search: string;
  status: string;
  sortBy: EmployeeSortBy;
  order: SortOrder;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSortByChange: (value: EmployeeSortBy) => void;
  onOrderChange: (value: SortOrder) => void;
};

export function EmployeeFilter({
  search,
  status,
  sortBy,
  order,
  onSearchChange,
  onStatusChange,
  onSortByChange,
  onOrderChange,
}: Readonly<EmployeeFilterProps>) {
  return (
    <search aria-label="직원 검색 및 필터" className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search aria-hidden="true" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          aria-label="직원 검색"
          placeholder="이름, 이메일, 직책으로 검색..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex items-center gap-2">
        <Select value={status || "all"} onValueChange={(value) => onStatusChange(value === "all" ? "" : value)}>
          <SelectTrigger aria-label="재직 상태 필터" className="w-[120px]">
            <SelectValue placeholder="상태" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 상태</SelectItem>
            <SelectItem value="active">재직</SelectItem>
            <SelectItem value="onLeave">휴직</SelectItem>
            <SelectItem value="resigned">퇴사</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(value) => onSortByChange(value as EmployeeSortBy)}>
          <SelectTrigger aria-label="정렬 기준" className="w-[110px]">
            <SelectValue placeholder="정렬" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="id">ID</SelectItem>
            <SelectItem value="name">이름</SelectItem>
            <SelectItem value="position">직책</SelectItem>
            <SelectItem value="hireDate">입사일</SelectItem>
            <SelectItem value="status">상태</SelectItem>
          </SelectContent>
        </Select>

        <Select value={order} onValueChange={(value) => onOrderChange(value as SortOrder)}>
          <SelectTrigger aria-label="정렬 순서" className="w-[110px]">
            <SelectValue placeholder="순서" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">오름차순</SelectItem>
            <SelectItem value="desc">내림차순</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </search>
  );
}
