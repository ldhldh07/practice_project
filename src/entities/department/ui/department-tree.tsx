import { ChevronDown, ChevronRight, Folder, FolderOpen } from "lucide-react";

import { cn } from "@shared/lib/cn";

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
        role="treeitem"
        tabIndex={0}
        aria-selected={isSelected}
        aria-level={depth + 1}
        {...(hasChildren ? { "aria-expanded": isExpanded } : {})}
        className={cn(
          "group flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm cursor-pointer transition-colors",
          isSelected
            ? "bg-accent text-accent-foreground font-medium"
            : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => onSelect(node.id)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect(node.id);
          }
        }}
      >
        {hasChildren ? (
          <button
            type="button"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? `${node.name} 접기` : `${node.name} 펼치기`}
            className="flex-shrink-0 rounded-sm p-0.5 hover:bg-accent"
            onClick={(e) => {
              e.stopPropagation();
              onToggle(node.id);
            }}
          >
            {isExpanded ? (
              <ChevronDown aria-hidden="true" className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
            )}
          </button>
        ) : (
          <span className="w-[18px] flex-shrink-0" />
        )}
        {hasChildren ? (
          isExpanded ? (
            <FolderOpen aria-hidden="true" className="h-4 w-4 flex-shrink-0 text-primary/70" />
          ) : (
            <Folder aria-hidden="true" className="h-4 w-4 flex-shrink-0 text-primary/70" />
          )
        ) : (
          <span className="w-4 flex-shrink-0" />
        )}
        <span className="truncate">{node.name}</span>
      </div>

      {hasChildren && isExpanded ? (
        <div role="group">
          {node.children.map((child) => (
            <DepartmentTreeNodeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
              expandedIds={expandedIds}
              onSelect={onSelect}
              onToggle={onToggle}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function DepartmentTree({ nodes, selectedId, expandedIds, onSelect, onToggle }: Readonly<DepartmentTreeProps>) {
  return (
    <div role="tree" aria-label="조직도" className="space-y-0.5">
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
