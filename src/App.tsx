import { useState, useEffect, MouseEvent } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Plus } from "@phosphor-icons/react";
import { useRouteLinkedList } from "./hooks/useRouteLinkedList";
import {
  getJobNameFromSelect,
  validateJobAddition,
  getCustomQueryFromRLL,
  getCurrentJobsFromQuery,
} from "./lib/routeUtils";
import { 
  generateTableImage, 
  downloadImage, 
  shareImage, 
  copyUrl, 
  handleShareError 
} from "./lib/shareUtils";
import JobSelector from "./components/JobSelector";
import PointAdjuster from "./components/PointAdjuster";

import ResetConfirmModal from "./components/ResetConfirmModal";
import ShareModal from "./components/ShareModal";
import BottomSheet from "./components/BottomSheet";
import AboutModal from "./components/AboutModal";
import AppHeader from "./components/AppHeader";
import RouteRow from "./components/RouteRow";
import "./prototype.css";



export default function App() {
  const {
    rLL,
    version,
    addJob,
    adjustPoint,
    removeAt,
    reset: resetRLL,
    setRLL,
    moveJob,
  } = useRouteLinkedList();

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;

    // Source and Destination indices are based on the Droppable list (0-indexed).
    // But the Droppable list corresponds to rLL indices 1..n.
    // So we need to add 1 to map to rLL indices.
    const fromIndex = result.source.index + 1;
    const toIndex = result.destination.index + 1;

    const success = moveJob(fromIndex, toIndex);
    if (!success) {
      setErrorMessage("같은 직업을 연속으로 배치할 수 없습니다.");
    }
    setSelectedIndex(null); // Clear selection to avoid confusion
  };

  // Currently selected row index for point adjustment
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  // Bottom panel open state
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  // Bottom panel mode: 'job-select' | 'point-adjust'
  const [panelMode, setPanelMode] = useState<"job-select" | "point-adjust">(
    "job-select"
  );
  // Error message for invalid job selection
  const [errorMessage, setErrorMessage] = useState<string>("");
  // Loading state for share functionality
  const [isSharing, setIsSharing] = useState(false);
  // Delete mode toggle state
  const [deleteMode, setDeleteMode] = useState(false);
  // Temporarily disable hover effects after deletion

  const [isDeleting, setIsDeleting] = useState(false);
  // Reset confirmation modal state
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  // Share modal state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  // URL copied state
  const [isUrlCopied, setIsUrlCopied] = useState(false);

  // Custom share text
  const [customShareText, setCustomShareText] = useState("");
  
  // Cumulative view toggle state
  const [isCumulative, setIsCumulative] = useState(false);

  // Reorder mode toggle state
  const [isReorderMode, setIsReorderMode] = useState(false);

  // About modal state
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  const getDisplayPoint = (index: number | null) => {
    if (index === null) return 0;
    const node = rLL.get(index);
    if (!node) return 0;
    return isCumulative ? (node.currentJobPos[node.job] || 0) : node.jobPo;
  };

  const openPanel = (mode: "job-select" | "point-adjust") => {
    setPanelMode(mode);
    setIsPanelOpen(true);
  };

  const closePanel = () => {
    setIsPanelOpen(false);
  };

  const adjustJobPoint = (adjustment: number) => {
    if (selectedIndex !== null) {
      adjustPoint(selectedIndex, adjustment);
    }
  };

  const addNewJob = (event: MouseEvent) => {
    const jobName = getJobNameFromSelect(event);

    const error = validateJobAddition(jobName, rLL);
    if (error) {
      setErrorMessage(error);
      return;
    }

    addJob(jobName);
    
    if (jobName !== '무직') {
      setPanelMode("point-adjust");
      // rLL is mutated synchronously, so length is already updated.
      // The new item is at the last index.
      setSelectedIndex(rLL.length - 1); 
    }
    setErrorMessage("");
  };

  const handleRowClick = (index: number) => {
    // Prevent point adjustment for "무직"
    if (rLL.get(index)?.job === '무직') return;

    setSelectedIndex(index);
    openPanel("point-adjust");
  };

  const handleDeleteJob = (index: number, event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    
    // Remove focus from the button to prevent hover state on mobile
    const target = event.currentTarget as HTMLButtonElement;
    target.blur();
    
    // Temporarily disable hover effects
    setIsDeleting(true);
    
    removeAt(index);
    if (selectedIndex === index) {
      setSelectedIndex(null);
      setIsPanelOpen(false);
    } else if (selectedIndex !== null && selectedIndex > index) {
      setSelectedIndex(selectedIndex - 1);
    }
    
    // Re-enable hover effects after a short delay
    setTimeout(() => {
      setIsDeleting(false);
    }, 200);
  };

  const handleAddClick = () => {
    openPanel("job-select");
  };

  const handleResetClick = () => {
    if (rLL.length <= 1) return;
    setIsResetConfirmOpen(true);
  };

  const performReset = () => {
    resetRLL();
    setSelectedIndex(null);
    setIsPanelOpen(false);
    setIsResetConfirmOpen(false);
    location.replace(`${location.origin}${location.pathname}`);
  };

  const handleShareClick = () => {
    setIsShareModalOpen(true);
  };

  const handleDownloadImage = async () => {
    if (isSharing) return;
    setIsSharing(true);
    try {
      const blob = await generateTableImage(rLL, ".route-list", customShareText);
      downloadImage(blob, "route-table.png");
      setIsShareModalOpen(false);
    } catch (error: any) {
      console.error("이미지 다운로드 실패:", error);
      alert("이미지 저장에 실패했습니다.");
    } finally {
      setIsSharing(false);
    }
  };

  const handleShareImage = async () => {
    if (isSharing) return;
    setIsSharing(true);
    try {
      const blob = await generateTableImage(rLL, ".route-list", customShareText);
      await shareImage(
        blob,
        "route-table.png"
      );
      setIsShareModalOpen(false);
    } catch (error: any) {
      await handleShareError(error, rLL);
    } finally {
      setIsSharing(false);
    }
  };

  const handleShareUrl = async () => {
    try {
      const queryToSave = getCustomQueryFromRLL(rLL);
      const urlToSave = `${location.origin}${location.pathname}${
        queryToSave.length === 0 ? "" : `?${queryToSave}`
      }`;
      
      await copyUrl(urlToSave);
      setIsUrlCopied(true);
      setTimeout(() => setIsUrlCopied(false), 2000);
    } catch (error: any) {
      console.error("URL 복사 실패:", error);
      alert("URL 복사에 실패했습니다.");
    }
  };

  const toggleDeleteMode = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Remove focus to prevent hover state on mobile
    event.currentTarget.blur();
    setDeleteMode(!deleteMode);
  };

  useEffect(() => {
    if (location.search.length > 0) {
      const newRLL = getCurrentJobsFromQuery(location);
      setRLL(newRLL);
      // Clean the URL after reflecting the data
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    const savedData = sessionStorage.getItem("elan-route-save");
    if (savedData) {
      const fakeLocation = { search: `?${savedData}` };
      const newRLL = getCurrentJobsFromQuery(fakeLocation as Location);
      setRLL(newRLL);
    }
  }, []);

  useEffect(() => {
    if (!errorMessage) return;
    const timeout = setTimeout(() => {
      setErrorMessage("");
    }, 2500);
    return () => clearTimeout(timeout);
  }, [errorMessage]);

  useEffect(() => {
    const queryToSave = getCustomQueryFromRLL(rLL);
    if (rLL.length > 0) {
      sessionStorage.setItem("elan-route-save", queryToSave);
    } else {
      sessionStorage.removeItem("elan-route-save");
    }
  }, [rLL, version]);

  useEffect(() => {
    if (!isPanelOpen) {
      const timer = setTimeout(() => {
        setSelectedIndex(null);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isPanelOpen]);

  return (
    <div className="app-container">
      <AppHeader
        rLLLength={rLL.length}
        isSharing={isSharing}
        isCumulative={isCumulative}
        isReorderMode={isReorderMode}
        deleteMode={deleteMode}
        onInfoClick={() => setIsAboutModalOpen(true)}
        onResetClick={handleResetClick}
        onShareClick={handleShareClick}
        onCumulativeToggle={() => setIsCumulative(!isCumulative)}
        onReorderToggle={() => setIsReorderMode(!isReorderMode)}
        onDeleteToggle={toggleDeleteMode}
      />

      <div className="content-wrapper">
        {/* Main Content Area */}
        <main className="main-content">
          
          {errorMessage && (
            <div className="mobile-only" style={{
              position: 'fixed',
              top: '100px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 100,
              width: '90%',
              maxWidth: '400px',
              color: 'var(--error)',
              padding: '0.75rem',
              textAlign: 'center',
              fontWeight: '600',
              fontSize: '0.875rem',
              backgroundColor: 'rgba(39, 39, 42, 0.95)', // Dark background
              border: '1px solid var(--error)',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              animation: 'fadeIn 0.2s ease-in-out',
              pointerEvents: 'none', // Allow clicking through if needed, but usually toast blocks interaction? No, let's allow clicks if it's just a message.
            }}>
              {errorMessage}
            </div>
          )}

          <div className="route-list" id="routeList">
            {/* Table Header */}
            <div className="route-header">
              <span className="header-job">직업</span>
              <div className="header-stats">
                <span className="header-stat">STR</span>
                <span className="header-stat">INT</span>
                <span className="header-stat">AGI</span>
                <span className="header-stat">VIT</span>
              </div>
              <span className="header-po">PO</span>
              {isReorderMode && <span className="header-drag"></span>}
              {deleteMode && <span className="header-delete"></span>}
            </div>

            {/* Static First Row (Jobless) */}
            {(() => {
              const allNodes = rLL.getAllNodes();
              const firstNode = allNodes[0];
              
              if (firstNode) {
                return (
                  <RouteRow
                    key={firstNode.id}
                    node={firstNode}
                    index={0}
                    isSelected={selectedIndex === 0}
                    isCumulative={isCumulative}
                    isReorderMode={isReorderMode}
                    deleteMode={deleteMode}
                    isDeleting={isDeleting}
                    isStatic={true}
                    onRowClick={handleRowClick}
                    onDeleteJob={handleDeleteJob}
                  />
                );
              }
              return null;
            })()}

            {/* Draggable Rows */}
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="route-list">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
                  >
                    {rLL.getAllNodes().slice(1).map((node, index) => {
                      if (!node) return null;
                      const originalIndex = index + 1;
                      
                      return (
                        <Draggable 
                          key={node.id} 
                          draggableId={node.id} 
                          index={index}
                          isDragDisabled={!isReorderMode}
                        >
                          {(provided, snapshot) => (
                            <RouteRow
                              node={node}
                              index={originalIndex}
                              isSelected={selectedIndex === originalIndex}
                              isCumulative={isCumulative}
                              isReorderMode={isReorderMode}
                              deleteMode={deleteMode}
                              isDeleting={isDeleting}
                              provided={provided}
                              snapshot={snapshot}
                              onRowClick={handleRowClick}
                              onDeleteJob={handleDeleteJob}
                            />
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            {/* Inline Add Button - Mobile Only */}
            <button className="add-row-btn mobile-only" onClick={handleAddClick}>
              <Plus weight="bold" />
              <span>직업 추가</span>
            </button>
          </div>

        </main>

        {/* Desktop Sidebar */}
        <aside className="desktop-sidebar"> 
          {/* Point Adjuster Section - Fixed at Top */}
             <div className="sidebar-header">
               <div className="point-adjuster-container" style={{ opacity: selectedIndex !== null ? 1 : 0.5, pointerEvents: selectedIndex !== null ? 'auto' : 'none' }}>
                  <PointAdjuster 
                    onPointAdjust={adjustJobPoint} 
                    onPointSet={(value) => {
                      if (selectedIndex !== null) {
                        const node = rLL.get(selectedIndex);
                        if (!node) return;
                        
                        let delta;
                        if (isCumulative) {
                           const currentCumulative = node.currentJobPos[node.job] || 0;
                           delta = value - currentCumulative;
                        } else {
                           const currentPoint = node.jobPo;
                           delta = value - currentPoint;
                        }
                        adjustJobPoint(delta);
                      }
                    }}
                    currentPoint={getDisplayPoint(selectedIndex)} 
                    selectedIndex={selectedIndex}
                  />
               </div>
             </div>

             {/* Divider */}
             <div className="sidebar-divider"></div>

             {/* Error Message Section - Fixed between Header and Content */}
             <div className="error-section">
                <div className={`error-message-container ${!errorMessage ? 'hidden' : ''}`}>
                  {errorMessage || " "}
                </div>
             </div>

             {/* Divider */}
             <div className="sidebar-divider"></div>

             {/* Job Selector Section - Scrollable */}
             <div className="sidebar-content">
               <div className="sidebar-section">

                 <JobSelector onJobSelect={addNewJob} />
               </div>
             </div>
        </aside>
      </div>

      <div className="mobile-only">
        <BottomSheet
          isOpen={isPanelOpen}
          onClose={closePanel}
        >
          {panelMode === 'job-select' ? (
            <JobSelector onJobSelect={addNewJob} />
          ) : (
            <PointAdjuster 
              onPointAdjust={adjustJobPoint} 
              onPointSet={(value) => {
                if (selectedIndex !== null) {
                  const node = rLL.get(selectedIndex);
                  if (!node) return;
                  
                  let delta;
                  if (isCumulative) {
                     const currentCumulative = node.currentJobPos[node.job] || 0;
                     delta = value - currentCumulative;
                  } else {
                     const currentPoint = node.jobPo;
                     delta = value - currentPoint;
                  }
                  adjustJobPoint(delta);
                }
              }}
              currentPoint={getDisplayPoint(selectedIndex)}
              selectedIndex={selectedIndex}
            />
          )}
        </BottomSheet>
      </div>



      <ResetConfirmModal 
        isOpen={isResetConfirmOpen} 
        onClose={() => setIsResetConfirmOpen(false)} 
        onConfirm={performReset} 
      />

      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        onDownloadImage={handleDownloadImage}
        onShareImage={handleShareImage}
        onShareUrl={handleShareUrl}
        isSharing={isSharing}
        isUrlCopied={isUrlCopied}
        customText={customShareText}
        onCustomTextChange={setCustomShareText}
      />

      <AboutModal 
        isOpen={isAboutModalOpen} 
        onClose={() => setIsAboutModalOpen(false)} 
      />

    </div>
  );
}
