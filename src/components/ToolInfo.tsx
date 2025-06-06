'use client'

import { useState, useRef, useEffect } from 'react'

interface ToolInfoProps {
  title?: string
  children: React.ReactNode
  defaultExpanded?: boolean
}

export default function ToolInfo({ 
  title = "Features & Details", 
  children, 
  defaultExpanded = false 
}: ToolInfoProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const contentRef = useRef<HTMLDivElement>(null)
  const [maxHeight, setMaxHeight] = useState<string>('0px')

  useEffect(() => {
    if (contentRef.current) {
      setMaxHeight(isExpanded ? `${contentRef.current.scrollHeight}px` : '0px')
    }
  }, [isExpanded, children])

  const handleToggle = () => {
    setIsExpanded(!isExpanded)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleToggle()
    }
  }

  return (
    <div className="tool-info-accordion">
      <button
        onClick={handleToggle}
        onKeyDown={handleKeyPress}
        className="tool-info-header"
        aria-expanded={isExpanded}
        aria-controls="tool-info-content"
        type="button"
      >
        <div className="tool-info-title">
          <span className="tool-info-icon">✦</span>
          <span className="font-cormorant-upright font-bold text-xl">{title}</span>
        </div>
        <div className={`tool-info-chevron ${isExpanded ? 'expanded' : ''}`}>
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </button>
      
      <div
        id="tool-info-content"
        ref={contentRef}
        className="tool-info-content"
        style={{ maxHeight }}
      >
        <div className="tool-info-inner">
          {children}
        </div>
      </div>

      <style jsx>{`
        .tool-info-accordion {
          margin: 1.5rem 0;
          border: 2px solid rgba(244, 208, 63, 0.3);
          border-radius: 12px;
          background: rgba(0, 0, 0, 0.2);
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .tool-info-accordion:hover {
          border-color: rgba(244, 208, 63, 0.5);
          box-shadow: 0 4px 12px rgba(244, 208, 63, 0.1);
        }

        .tool-info-header {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.5rem;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          color: var(--foreground);
        }

        .tool-info-header:hover {
          background: rgba(244, 208, 63, 0.1);
        }

        .tool-info-header:focus {
          outline: 2px solid var(--accent);
          outline-offset: -2px;
        }

        .tool-info-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--foreground);
        }

        .tool-info-icon {
          color: var(--accent);
          font-size: 1.2rem;
        }

        .tool-info-chevron {
          color: var(--accent);
          transition: transform 0.3s ease;
          display: flex;
          align-items: center;
        }

        .tool-info-chevron.expanded {
          transform: rotate(180deg);
        }

        .tool-info-content {
          overflow: hidden;
          transition: max-height 0.3s ease-in-out;
          background: rgba(0, 0, 0, 0.1);
        }

        .tool-info-inner {
          padding: 1.5rem;
          border-top: 1px solid rgba(244, 208, 63, 0.2);
        }

        .tool-info-inner :global(h2) {
          color: var(--foreground);
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .tool-info-inner :global(h3) {
          color: var(--accent);
          font-size: 1.1rem;
          font-weight: 600;
          margin: 1.5rem 0 0.75rem 0;
        }

        .tool-info-inner :global(p) {
          color: var(--muted);
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .tool-info-inner :global(ul) {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .tool-info-inner :global(li) {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
          color: var(--muted);
          line-height: 1.5;
        }

        .tool-info-inner :global(li::before) {
          content: '✦';
          color: var(--accent);
          margin-top: 0.1rem;
          flex-shrink: 0;
        }

        .tool-info-inner :global(.feature-grid) {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
          margin: 1rem 0;
        }

        .tool-info-inner :global(.feature-card) {
          background: rgba(244, 208, 63, 0.1);
          border: 1px solid rgba(244, 208, 63, 0.3);
          border-radius: 8px;
          padding: 1rem;
        }

        .tool-info-inner :global(.feature-card h4) {
          color: var(--accent);
          font-size: 1rem;
          font-weight: 600;
          margin: 0 0 0.5rem 0;
        }

        .tool-info-inner :global(.feature-card p) {
          margin: 0;
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .tool-info-header {
            padding: 0.875rem 1rem;
          }

          .tool-info-title {
            font-size: 1rem;
            gap: 0.5rem;
          }

          .tool-info-inner {
            padding: 1rem;
          }

          .tool-info-inner :global(.feature-grid) {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }

          .tool-info-inner :global(.feature-card) {
            padding: 0.75rem;
          }
        }
      `}</style>
    </div>
  )
} 