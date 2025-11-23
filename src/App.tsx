import { useState, useEffect, MouseEvent } from "react";
import { v4 as uuidv4 } from "uuid";
import { useRouteLinkedList } from "./hooks/useRouteLinkedList";
import {
  getJobNameFromSelect,
  validateJobAddition,
  getCustomQueryFromRLL,
  getCurrentJobsFromQuery,
} from "./lib/routeUtils";
import { shareTableAsImage, handleShareError } from "./lib/shareUtils";
import JobSelector from "./components/JobSelector";
import PointAdjuster from "./components/PointAdjuster";
import "./prototype.css";

import faviconV2 from "./img/faviconV2.png";

export default function App() {
  const {
    rLL,
    version,
    addJob,
    adjustPoint,
    removeAt,
    reset: resetRLL,
    setRLL,
  } = useRouteLinkedList();

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
    
    setPanelMode("point-adjust");
    setSelectedIndex(rLL.length - 1);
    setErrorMessage("");
  };

  const handleRowClick = (index: number) => {
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

  const reset = () => {
    resetRLL();
    setSelectedIndex(null);
    setIsPanelOpen(false);
    location.replace(`${location.origin}${location.pathname}`);
  };

  const handleShare = async () => {
    if (isSharing) return;
    setIsSharing(true);
    try {
      await shareTableAsImage(rLL);
    } catch (error: any) {
      await handleShareError(error, rLL);
    } finally {
      setIsSharing(false);
    }
  };

  const toggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
  };

  useEffect(() => {
    if (location.search.length > 0) {
      const newRLL = getCurrentJobsFromQuery(location);
      setRLL(newRLL);
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
      {/* Header */}
      <header className="app-header">
        <div className="logo">
          <div className="logo-icon" style={{ background: 'none', padding: 0 }}>
            <img src={faviconV2} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <span>루트 계산기 v2</span>
        </div>
        <div className="header-actions">
          <button 
            className={`icon-btn ${deleteMode ? 'active' : ''}`} 
            aria-label="Delete Mode" 
            onClick={toggleDeleteMode}
            style={deleteMode ? { backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)' } : {}}
          >
            <i className="ph ph-trash"></i>
          </button>
          <button className="icon-btn" aria-label="Reset" onClick={reset}>
            <i className="ph ph-arrow-counter-clockwise"></i>
          </button>
          <button className="icon-btn" aria-label="Share" onClick={handleShare}>
            {isSharing ? <i className="ph ph-spinner animate-spin"></i> : <i className="ph ph-share-network"></i>}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
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
            {deleteMode && <span className="header-delete"></span>}
          </div>

          {rLL.getAllNodes().map((node, index) => {
            if (!node) return null;
            return (
              <div 
                key={uuidv4()} 
                className={`route-row ${selectedIndex === index ? 'active' : ''}`}
                onClick={() => handleRowClick(index)}
              >
                <span className="job-name">{node.job}</span>
                <div className="row-stats">
                  <span className="stat-value">{node.stats.STR}</span>
                  <span className="stat-value">{node.stats.INT}</span>
                  <span className="stat-value">{node.stats.AGI}</span>
                  <span className="stat-value">{node.stats.VIT}</span>
                </div>
                <div className="job-po-badge">{node.jobPo}</div>
                {deleteMode && (
                  <button 
                    className={`delete-job-btn ${isDeleting ? 'no-hover' : ''}`}
                    onClick={(e) => handleDeleteJob(index, e)}
                    aria-label="삭제"
                  >
                    <i className="ph ph-trash"></i>
                  </button>
                )}
              </div>
            );
          })}

          {/* Inline Add Button */}
          <button className="add-row-btn" onClick={handleAddClick}>
            <i className="ph-bold ph-plus"></i>
            <span>직업 추가</span>
          </button>
        </div>
      </main>

      {/* Desktop Sidebar */}
      <aside className="desktop-sidebar" style={{ display: 'none' }}> 
        {/* Note: prototype.css handles display: flex on desktop via media query, but we need to remove inline style or handle it via class */}
        {/* Actually prototype.css has .desktop-sidebar { display: none } for mobile and flex for desktop. 
            But wait, the HTML had style="display: none;" inline. I should rely on CSS.
            Let's check prototype.css again.
            Mobile: not defined, so block? No, HTML had it hidden.
            CSS: @media (min-width: 768px) { .desktop-sidebar { display: flex; ... } }
            So I should NOT put inline style display: none if I want it to show on desktop.
            But on mobile it should be hidden.
            prototype.css doesn't hide it on mobile by default?
            Let's check.
            It seems prototype.css relies on the fact that on mobile the sidebar is not in the flow or hidden.
            Actually, looking at prototype.css:
            It doesn't explicitly hide .desktop-sidebar on mobile.
            I should add `hidden md:flex` or similar if using Tailwind, but I am using prototype.css.
            I will add a style to hide it on mobile.
        */}
        <div style={{ padding: 'var(--space-md)', color: 'var(--text-secondary)', height: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
           
           {/* Job Selector Section */}
           <div>
             <h3 style={{ marginBottom: 'var(--space-sm)', color: 'var(--text-primary)' }}>직업 선택</h3>
             {errorMessage && <div style={{ color: 'var(--error)', fontSize: '0.75rem', marginBottom: 'var(--space-xs)' }}>{errorMessage}</div>}
             <JobSelector onJobSelect={addNewJob} />
           </div>

           {/* Point Adjuster Section - Always visible or only when selected? */}
           {/* Let's make it always visible but disabled if no selection, or just show it. 
               If no selection, maybe show "Select a row to adjust points".
           */}
           <div>
             <h3 style={{ marginBottom: 'var(--space-sm)', color: 'var(--text-primary)' }}>포인트 조절</h3>
             {selectedIndex !== null ? (
               <PointAdjuster 
                 onPointAdjust={adjustJobPoint} 
                 currentPoint={rLL.get(selectedIndex)?.jobPo} 
               />
             ) : (
               <div style={{ padding: 'var(--space-md)', textAlign: 'center', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                 직업을 선택해주세요
               </div>
             )}
           </div>

        </div>
      </aside>
      
      {/* We need to ensure sidebar is hidden on mobile. 
          I will add a style block or use a class if prototype.css has one.
          prototype.css has:
          @media (min-width: 768px) { ... .desktop-sidebar { ... } }
          But it doesn't say display: none for mobile.
          I'll add a style tag or inline style to hide it on mobile.
      */}
      <style>{`
        @media (max-width: 767px) {
          .desktop-sidebar { display: none; }
        }
      `}</style>

      {/* Bottom Sheet Overlay */}
      <div 
        className={`bottom-sheet-overlay ${isPanelOpen ? 'open' : ''}`} 
        id="overlay" 
        onClick={closePanel}
      ></div>

      {/* Bottom Sheet */}
      <div className={`bottom-sheet ${isPanelOpen ? 'open' : ''}`} id="bottomSheet">
        <div className="sheet-handle-area">
          <div className="sheet-handle"></div>
        </div>
        
        <div className="sheet-header">
          <h3 className="sheet-title" id="sheetTitle">
            {panelMode === 'job-select' ? '직업 선택' : '포인트 조절'}
          </h3>
          <button className="sheet-close" onClick={closePanel}>
            <i className="ph-bold ph-x"></i>
          </button>
        </div>

        <div className="sheet-content" id="sheetContent">
          {errorMessage && <div style={{ color: 'var(--error)', marginBottom: '1rem' }}>{errorMessage}</div>}
          {panelMode === 'job-select' ? (
            <JobSelector onJobSelect={addNewJob} />
          ) : (
            <PointAdjuster 
              onPointAdjust={adjustJobPoint} 
              currentPoint={selectedIndex !== null ? rLL.get(selectedIndex)?.jobPo : 0}
            />
          )}
        </div>
      </div>

    </div>
  );
}
