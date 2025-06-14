'use client'

import { useState, useCallback } from 'react'
import ToolInfo from '@/components/ToolInfo'
import { Button } from '@/components/Button'
import { QuestionTooltip, TooltipProvider } from '@/components/FantasyTooltip'

interface FearTrackerComponentProps {}

export default function FearTrackerComponent({}: FearTrackerComponentProps) {
  const [fear, setFear] = useState(0)
  const [isShaking, setIsShaking] = useState(false)
  const maxFear = 12

  const triggerShake = useCallback((isMaxFear = false) => {
    setIsShaking(true)
    setTimeout(() => setIsShaking(false), isMaxFear ? 500 : 300)
  }, [])

  const increaseFear = useCallback(() => {
    if (fear < maxFear) {
      setFear(prev => prev + 1)
      triggerShake(false)
    } else {
      // Max fear reached - stronger shake effect
      triggerShake(true)
    }
  }, [fear, maxFear, triggerShake])

  const decreaseFear = useCallback(() => {
    if (fear > 0) {
      setFear(prev => prev - 1)
    }
  }, [fear])

  const renderSkulls = () => {
    if (fear === 0) {
      return (
        <div className="no-fear">
          No fear... yet
        </div>
      )
    }

    const skulls = []
    for (let i = 0; i < fear; i++) {
      skulls.push(
        <div
          key={i}
          className={`skull ${fear === maxFear ? 'skull-max' : ''}`}
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          <span className="text-xl sm:text-3xl">💀</span>
        </div>
      )
    }

    if (fear === maxFear) {
      skulls.push(
        <div key="max-text" className="max-fear-text w-full text-red-500 font-semibold text-lg sm:text-xl">
          MAXIMUM FEAR!
        </div>
      )
    }

    return skulls
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center -mt-2">
          <p className="text-lg text-muted-foreground italic leading-relaxed mx-auto">
            Track fear levels from 0-12 with visual skull indicators and shake effects
          </p>
        </div>

        {/* Fear Tracker Tool */}
        <div className="fear-tracker-container">
          <div className={`fear-tracker-main ${isShaking ? (fear === maxFear ? 'shake-max' : 'shake') : ''}`}>
            {/* Fear Display */}
            <div className="fear-display">
              <div className="fear-count">
                Fear: <span className="fear-value">{fear}</span>/12
              </div>
              <div className="skulls-container">
                {renderSkulls()}
              </div>
            </div>
            
            {/* Controls */}
            <div className="fear-controls">
              <div className="flex items-center gap-2">
                <Button
                  onClick={decreaseFear}
                  disabled={fear === 0}
                  variant="fear-control"
                  size="fear-control"
                >
                  −
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={increaseFear}
                  disabled={false}
                  variant="fear-control"
                  size="fear-control"
                >
                  +
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information Accordion */}
        <ToolInfo title="About Fear Tracker">
          <h3>How It Works</h3>
          <p>
            The Fear Tracker helps you monitor the looming doom and tension in your Daggerheart campaigns from 0-12. 
            You can share your screen with your players, to show them the fear level and the skulls and make them feel the dread.
            As fear increases, visual skull indicators appear with animated effects to enhance the atmosphere at your table.
          </p>
          
          <h3>Key Features</h3>
          <div className="feature-grid">
            <div className="feature-card">
              <h4>Visual Indicators</h4>
              <p>Animated skulls appear as fear increases, with enhanced effects at maximum fear</p>
            </div>
            <div className="feature-card">
              <h4>Maximum Fear Warning</h4>
              <p>Special visual treatment when fear reaches the maximum level of 12</p>
            </div>
            <div className="feature-card">
              <h4>Easy Controls</h4>
              <p>Simple +/- buttons for quick fear adjustments during gameplay</p>
            </div>
          </div>

          <h3>Fear in Daggerheart</h3>
          <ul className="list-none p-0 my-4 text-muted-foreground">
            <li className="flex items-start gap-3 mb-3 leading-normal before:content-['✦'] before:text-accent before:mt-0.5 before:flex-shrink-0">
              DMs collect fear points, when players roll theirs duality die with &quot;Fear&quot;
            </li>
            <li className="flex items-start gap-3 mb-3 leading-normal before:content-['✦'] before:text-accent before:mt-0.5 before:flex-shrink-0">
              Fear can be spent in different ways to add complications to the story
            </li>
            <li className="flex items-start gap-3 mb-3 leading-normal before:content-['✦'] before:text-accent before:mt-0.5 before:flex-shrink-0">
              The more fear a DM collected, the &apos;interesting&apos; things can get...
            </li>
          </ul>
        </ToolInfo>

        <style jsx>{`
          .fear-tracker-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 60vh;
            padding: 2rem;
          }

          .fear-tracker-main {
            background: rgba(26, 20, 68, 0.95);
            border: 3px solid var(--accent);
            border-radius: 20px;
            padding: 3rem;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5),
                        inset 0 0 20px rgba(244, 208, 63, 0.1);
            text-align: center;
            position: relative;
            min-width: 400px;
            max-width: 600px;
            width: 100%;
          }

          .fear-tracker-main::before,
          .fear-tracker-main::after {
            content: '';
            position: absolute;
            width: 40px;
            height: 40px;
            border: 2px solid var(--accent);
          }

          .fear-tracker-main::before {
            top: -5px;
            left: -5px;
            border-right: none;
            border-bottom: none;
          }

          .fear-tracker-main::after {
            bottom: -5px;
            right: -5px;
            border-left: none;
            border-top: none;
          }

          .fear-display {
            background: rgba(0, 0, 0, 0.3);
            border-radius: 15px;
            padding: 2rem;
            margin: 2rem 0;
            border: 2px solid rgba(244, 208, 63, 0.3);
          }

          .fear-count {
            font-size: 2rem;
            color: var(--accent);
            margin-bottom: 1.5rem;
            font-weight: bold;
            text-shadow: 0 0 10px rgba(244, 208, 63, 0.5);
          }

          .fear-value {
            color: var(--accent);
            font-weight: bold;
          }

          .skulls-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 15px;
            min-height: 60px;
            align-items: center;
          }

          .skull {
            font-size: 3rem;
            filter: drop-shadow(0 0 10px rgba(255, 0, 0, 0.6));
            animation: pulse 2s ease-in-out infinite;
            transition: transform 0.3s ease;
            cursor: pointer;
          }

          .skull:hover {
            transform: scale(1.2) rotate(10deg);
          }

          .skull-max {
            filter: drop-shadow(0 0 15px rgba(255, 0, 0, 0.9));
          }

          .no-fear {
            color: var(--muted);
            font-style: italic;
            font-size: 1.5rem;
            opacity: 0.7;
          }

          .max-fear-text {
            width: 100%;
            margin-top: 20px;
            color: #ff4444;
            font-size: 1.5rem;
            font-weight: bold;
            text-shadow: 0 0 10px rgba(255, 68, 68, 0.8);
            text-transform: uppercase;
            letter-spacing: 2px;
          }

          .fear-controls {
            display: flex;
            justify-content: center;
            gap: 2rem;
            margin-top: 2rem;
          }

          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }

          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
          }

          @keyframes shake-max {
            0%, 100% { transform: translateX(0) rotateZ(0deg); }
            20% { transform: translateX(-15px) rotateZ(-2deg); }
            40% { transform: translateX(15px) rotateZ(2deg); }
            60% { transform: translateX(-15px) rotateZ(-2deg); }
            80% { transform: translateX(15px) rotateZ(2deg); }
          }

          .shake {
            animation: shake 0.3s ease-in-out;
          }

          .shake-max {
            animation: shake-max 0.5s ease-in-out;
          }

          @media (max-width: 768px) {
            .fear-tracker-main {
              padding: 2rem;
              min-width: 300px;
            }

            .fear-title {
              font-size: 2.5rem;
            }

            .fear-count {
              font-size: 1.5rem;
            }

            .skull {
              font-size: 2.5rem;
            }

            .fear-controls {
              gap: 1.5rem;
            }
          }
        `}</style>
      </div>
    </TooltipProvider>
  )
} 