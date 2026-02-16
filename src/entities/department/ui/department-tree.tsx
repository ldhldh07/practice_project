import { ChevronDown, ChevronRight } from "lucide-react";

import type { DepartmentTreeNode } from "../model/department.types";

type DepartmentTreeProps = {
  nodes: DepartmentTreeNode[];
  selectedId: number | null;
  expandedIds: Set<number>;
  onSelect: (id: number) => void;
  onToggle: (id: number) => void;
};

type DepartmentTreeNodeItemProps = {
  node: DepartmentTreeNode;
  depth: number;
  selectedId: number | null;
  expandedIds: Set<number>;
  onSelect: (id: number) => void;
  onToggle: (id: number) => void;
};

function DepartmentTreeNodeItem({
  node,
  depth,
  selectedId,
  expandedIds,
  onSelect,
  onToggle,
}: Readonly<DepartmentTreeNodeItemProps>) {
  const isSelected = selectedId === node.id;
  const hasChildren = node.children.length > 0;
  const isExpanded = expandedIds.has(node.id);

  return (
    <div>
      <div
        className={`flex items-center h-9 px-2 rounded cursor-pointer text-sm ${isSelected ? "bg-blue-50 text-blue-700" : "hover:bg-gray-100"}`}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={() => onSelect(node.id)}
      >
        {hasChildren ? (
          <button
            type="button"
            className="mr-1"
            onClick={(e) => {
              e.stopPropagation();
              onToggle(node.id);
            }}
          >
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        ) : (
          <span className="w-[18px] mr-1" />
        )}
        <span className="truncate">{node.name}</span>
      </div>

      {hasChildren && isExpanded
        ? node.children.map((child) => (
            <DepartmentTreeNodeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
              expandedIds={expandedIds}
              onSelect={onSelect}
              onToggle={onToggle}
            />
          ))
        : null}
    </div>
  );
}

export function DepartmentTree({ nodes, selectedId, expandedIds, onSelect, onToggle }: Readonly<DepartmentTreeProps>) {
  return (
    <div className="space-y-1">
      {nodes.map((node) => (
        <DepartmentTreeNodeItem
          key={node.id}
          node={node}
          depth={0}
          selectedId={selectedId}
          expandedIds={expandedIds}
          onSelect={onSelect}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}
