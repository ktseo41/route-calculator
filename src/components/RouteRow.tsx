import { DraggableProvided, DraggableStateSnapshot } from "@hello-pangea/dnd";
import { DotsSixVertical, Trash } from "@phosphor-icons/react";
import { RouteNode } from "../lib/routeLinkedList";

interface RouteRowProps {
  node: RouteNode;
  index: number;
  isSelected: boolean;
  isCumulative: boolean;
  isReorderMode: boolean;
  deleteMode: boolean;
  isDeleting: boolean;
  isStatic?: boolean; // 첫 번째 row (무직)는 드래그 불가
  provided?: DraggableProvided;
  snapshot?: DraggableStateSnapshot;
  onRowClick: (index: number) => void;
  onDeleteJob: (index: number, event: React.MouseEvent) => void;
}

const RouteRow = ({
  node,
  index,
  isSelected,
  isCumulative,
  isReorderMode,
  deleteMode,
  isDeleting,
  isStatic = false,
  provided,
  snapshot,
  onRowClick,
  onDeleteJob,
}: RouteRowProps) => {
  const displayPoint = isCumulative 
    ? (node.currentJobPos[node.job] || 0) 
    : node.jobPo;

  // Static row (첫 번째 무직 row)
  if (isStatic) {
    return (
      <div 
        className={`route-row ${isSelected ? 'active' : ''}`}
        style={{ cursor: 'default' }}
        onClick={() => onRowClick(index)}
      >
        <span className="job-name">{node.job}</span>
        <div className="row-stats">
          <span className="stat-value">{node.stats.STR}</span>
          <span className="stat-value">{node.stats.INT}</span>
          <span className="stat-value">{node.stats.AGI}</span>
          <span className="stat-value">{node.stats.VIT}</span>
        </div>
        <div className={`job-po-badge ${isCumulative ? 'cumulative' : ''}`}>{displayPoint}</div>
        {isReorderMode && (
          <div style={{ width: '32px', marginLeft: '4px', flexShrink: 0 }}></div>
        )}
        {deleteMode && (
          <div style={{ width: '32px', marginLeft: '4px', flexShrink: 0 }}></div>
        )}
      </div>
    );
  }

  // Draggable row
  return (
    <div
      ref={provided?.innerRef}
      {...provided?.draggableProps}
      style={{
        ...provided?.draggableProps.style,
        cursor: 'pointer',
        opacity: snapshot?.isDragging ? 0.8 : 1,
      }}
      className={`route-row ${isSelected ? 'active' : ''}`}
      onClick={() => onRowClick(index)}
    >
      <span className="job-name">{node.job}</span>
      <div className="row-stats">
        <span className="stat-value">{node.stats.STR}</span>
        <span className="stat-value">{node.stats.INT}</span>
        <span className="stat-value">{node.stats.AGI}</span>
        <span className="stat-value">{node.stats.VIT}</span>
      </div>
      <div className={`job-po-badge ${isCumulative ? 'cumulative' : ''}`}>{displayPoint}</div>
      {isReorderMode && (
        <div
          className="drag-handle"
          {...provided?.dragHandleProps}
        >
          <DotsSixVertical />
        </div>
      )}
      {deleteMode && (
        <button 
          className={`delete-job-btn ${isDeleting ? 'no-hover' : ''}`}
          onClick={(e) => onDeleteJob(index, e)}
          aria-label="삭제"
        >
          <Trash />
        </button>
      )}
    </div>
  );
};

export default RouteRow;
