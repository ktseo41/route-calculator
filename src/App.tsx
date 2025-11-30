import { useState, useEffect, MouseEvent } from "react";
import { v4 as uuidv4 } from "uuid";
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
import "./prototype.css";

import logo from "./img/logo.png";

const ToggleSwitch = ({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) => (
  <div className="toggle-container" onClick={onChange}>
    <div className="toggle-switch">
      <input type="checkbox" checked={checked} readOnly />
      <span className="toggle-slider"></span>
    </div>
    <span className="toggle-label-text">{label}</span>
  </div>
);


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
      {/* Header */}
      <header className="app-header">
        <div className="logo">
          <div className="logo-icon" style={{ background: 'none', padding: 0 }}>
            <img src={logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <span className="title">루트 계산기</span>
          <span className="version">v2.0.0</span>
        </div>
        <div className="header-actions">
          <div className="desktop-only">
            <ToggleSwitch 
              checked={isCumulative} 
              onChange={() => setIsCumulative(!isCumulative)} 
              label="누적 잡포인트 보기" 
            />
          </div>
          <button 
            className={`icon-btn ${deleteMode ? 'active' : ''}`} 
            aria-label="Delete Mode" 
            onClick={toggleDeleteMode}
            style={deleteMode ? { backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)' } : {}}
          >
            <i className="ph ph-minus-circle"></i>
          </button>
          <button 
            className="icon-btn" 
            aria-label="Reset" 
            onClick={handleResetClick}
            style={rLL.length <= 1 ? { opacity: 0.3, cursor: 'not-allowed' } : {}}
          >
            <i className="ph ph-broom"></i>
          </button>
          <button className="icon-btn" aria-label="Share" onClick={handleShareClick}>
            {isSharing ? <i className="ph ph-spinner animate-spin"></i> : <i className="ph ph-share-network"></i>}
          </button>
        </div>
      </header>

      <div className="content-wrapper">
        {/* Main Content Area */}
        <main className="main-content">
          <div className="mobile-toggle-area">
            <ToggleSwitch 
              checked={isCumulative} 
              onChange={() => setIsCumulative(!isCumulative)} 
              label="누적 잡포인트 보기" 
            />
          </div>
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
                  style={{ cursor: node.job === '무직' ? 'default' : 'pointer' }}
                  onClick={() => handleRowClick(index)}
                >
                  <span className="job-name">{node.job}</span>
                  <div className="row-stats">
                    <span className="stat-value">{node.stats.STR}</span>
                    <span className="stat-value">{node.stats.INT}</span>
                    <span className="stat-value">{node.stats.AGI}</span>
                    <span className="stat-value">{node.stats.VIT}</span>
                  </div>
                  <div className="job-po-badge">
                    {isCumulative ? (node.currentJobPos[node.job] || 0) : node.jobPo}
                  </div>
                  {deleteMode && (
                    node.job === '무직' ? (
                      <div style={{ width: '32px', marginLeft: '4px', flexShrink: 0 }}></div>
                    ) : (
                      <button 
                        className={`delete-job-btn ${isDeleting ? 'no-hover' : ''}`}
                        onClick={(e) => handleDeleteJob(index, e)}
                        aria-label="삭제"
                      >
                        <i className="ph ph-trash"></i>
                      </button>
                    )
                  )}
                </div>
              );
            })}

            {/* Inline Add Button - Mobile Only */}
            <button className="add-row-btn mobile-only" onClick={handleAddClick}>
              <i className="ph-bold ph-plus"></i>
              <span>직업 추가</span>
            </button>
          </div>

          <footer className="app-footer">
            <button className="footer-link" onClick={() => setIsAboutModalOpen(true)}>
              About
            </button>
          </footer>
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
          {errorMessage && <div style={{ color: 'var(--error)', marginBottom: '1rem' }}>{errorMessage}</div>}
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

      {isAboutModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAboutModalOpen(false)}>
          <div className="modal-content about-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>about</h3>
              <button className="close-btn" onClick={() => setIsAboutModalOpen(false)}>
                <i className="ph ph-x"></i>
              </button>
            </div>
            <div className="modal-body">
              <p>루트 계산기를 이용해 주셔서 감사합니다.</p>
              <p>이 앱은 여러분의 캐릭터 육성 시뮬레이션을 돕기 위해 제작되었습니다.</p>
              <br />
              <p>문의사항이나 건의사항이 있으시면 언제든 연락주세요.</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
