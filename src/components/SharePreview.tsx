import React, { forwardRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import RouteLinkedList from '../lib/routeLinkedList';
import { getCustomQueryFromRLL } from '../lib/routeUtils';
import logo from '../img/logo.png';

interface SharePreviewProps {
  rLL: RouteLinkedList;
  customText: string;
}

const SharePreview = forwardRef<HTMLDivElement, SharePreviewProps>(({ rLL, customText }, ref) => {
  if (!rLL) return null;
  const queryToSave = getCustomQueryFromRLL(rLL);

  return (
    <div 
      ref={ref}
      className="share-preview-container"
      style={{
        backgroundColor: '#27272a', // Zinc 800
        borderRadius: '12px',
        padding: '16px',
        width: '100%',
        maxWidth: '400px',
        margin: '0 auto',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}
    >
      {/* Table Header */}
      <div className="route-header" style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '8px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
        <span style={{ flex: 1 }}>직업</span>
        <div style={{ display: 'flex', gap: '8px', width: '140px', justifyContent: 'center' }}>
          <span style={{ width: '28px', textAlign: 'center' }}>STR</span>
          <span style={{ width: '28px', textAlign: 'center' }}>INT</span>
          <span style={{ width: '28px', textAlign: 'center' }}>AGI</span>
          <span style={{ width: '28px', textAlign: 'center' }}>VIT</span>
        </div>
        <span style={{ width: '40px', textAlign: 'center' }}>PO</span>
      </div>

      {/* Table Body */}
      <div className="route-body">
        {rLL.getAllNodes().map((node) => {
          if (!node) return null;
          return (
            <div 
              key={uuidv4()} 
              className="route-row"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '8px 0', 
                borderBottom: '1px solid var(--border-color)',
                fontSize: '14px',
                color: 'var(--text-primary)'
              }}
            >
              <span style={{ flex: 1, fontWeight: 500 }}>{node.job}</span>
              <div style={{ display: 'flex', gap: '8px', width: '140px', justifyContent: 'center' }}>
                <span style={{ width: '28px', textAlign: 'center', color: 'var(--text-secondary)' }}>{node.stats.STR}</span>
                <span style={{ width: '28px', textAlign: 'center', color: 'var(--text-secondary)' }}>{node.stats.INT}</span>
                <span style={{ width: '28px', textAlign: 'center', color: 'var(--text-secondary)' }}>{node.stats.AGI}</span>
                <span style={{ width: '28px', textAlign: 'center', color: 'var(--text-secondary)' }}>{node.stats.VIT}</span>
              </div>
              <div style={{ width: '40px', display: 'flex', justifyContent: 'center' }}>
                <span style={{ 
                  backgroundColor: 'var(--accent-dark)', 
                  padding: '2px 6px', 
                  borderRadius: '4px', 
                  fontSize: '12px', 
                  fontWeight: 600,
                  minWidth: '24px',
                  textAlign: 'center'
                }}>
                  {node.jobPo}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '16px',
        paddingTop: '12px',
        borderTop: '1px solid var(--border-color)',
      }}>
        {/* URL */}
        <div style={{
          fontSize: '10px',
          color: 'rgba(255, 255, 255, 0.3)',
          fontFamily: 'monospace',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          maxWidth: '60%'
        }}>
          {queryToSave}
        </div>

        {/* Signature */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <img 
            src={logo} 
            alt="Logo" 
            style={{ width: '16px', height: '16px', objectFit: 'contain' }} 
          />
          <span style={{
            fontSize: '12px',
            fontWeight: 'bold',
            color: 'rgba(255, 255, 255, 0.5)'
          }}>
            {customText ? `${customText} · 루트 계산기` : "루트 계산기"}
          </span>
        </div>
      </div>
    </div>
  );
});

SharePreview.displayName = 'SharePreview';

export default SharePreview;
