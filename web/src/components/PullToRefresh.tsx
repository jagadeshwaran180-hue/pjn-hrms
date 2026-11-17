import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { ArrowDown, RotateCw, CheckCircle2 } from 'lucide-react';
import { useRefresh } from '../context/RefreshContext';

interface PullToRefreshProps {
  children: ReactNode;
}

const PULL_THRESHOLD = 65; // Pixels needed to trigger refresh
const MAX_PULL = 95;      // Max visual displacement

export const PullToRefresh: React.FC<PullToRefreshProps> = ({ children }) => {
  const { isRefreshing, refresh } = useRefresh();
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const startY = useRef(0);
  const isEligible = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevRefreshing = useRef(false);

  // Detect completion of refresh to briefly flash success checkmark
  useEffect(() => {
    if (prevRefreshing.current && !isRefreshing) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 1200);
      return () => clearTimeout(timer);
    }
    prevRefreshing.current = isRefreshing;
  }, [isRefreshing]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      // Only initiate pull-to-refresh if user is at the very top of the scrollable viewport
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      if (scrollTop <= 2 && !isRefreshing) {
        startY.current = e.touches[0].clientY;
        isEligible.current = true;
      } else {
        isEligible.current = false;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isEligible.current || isRefreshing) return;

      const currentY = e.touches[0].clientY;
      const rawDistance = currentY - startY.current;

      // Only respond to downward pulls from the top
      if (rawDistance > 0) {
        const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
        if (scrollTop <= 2) {
          // Damped resistance curve for natural touch feel
          const damped = Math.min(Math.pow(rawDistance, 0.85), MAX_PULL);
          setPullDistance(damped);
          setIsPulling(true);

          // Prevent default browser bounce when pulling from the top
          if (e.cancelable && rawDistance > 10) {
            e.preventDefault();
          }
        }
      } else {
        setPullDistance(0);
        setIsPulling(false);
      }
    };

    const handleTouchEnd = () => {
      if (!isEligible.current) return;
      isEligible.current = false;
      setIsPulling(false);

      if (pullDistance >= PULL_THRESHOLD && !isRefreshing) {
        refresh();
      }
      setPullDistance(0);
    };

    const handleTouchCancel = () => {
      isEligible.current = false;
      setIsPulling(false);
      setPullDistance(0);
    };

    // Attach listeners with { passive: false } to allow preventDefault on downward overscroll
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchCancel, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchCancel);
    };
  }, [isRefreshing, pullDistance, refresh]);

  // Determine indicator position and animation
  const activeDistance = isRefreshing ? 55 : showSuccess ? 42 : pullDistance;
  const pullProgress = Math.min(pullDistance / PULL_THRESHOLD, 1);
  const isReadyToRelease = pullDistance >= PULL_THRESHOLD;

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Visual Pull Indicator Container */}
      <div
        className="fixed top-16 left-0 right-0 z-40 flex items-center justify-center pointer-events-none transition-all duration-200"
        style={{
          transform: `translateY(${activeDistance > 0 ? activeDistance - 15 : -60}px)`,
          opacity: activeDistance > 15 ? 1 : 0,
        }}
      >
        <div className="bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-lg border border-purple-100 flex items-center gap-2 text-xs font-semibold text-gray-700 animate-in fade-in">
          {showSuccess ? (
            <>
              <CheckCircle2 size={16} className="text-emerald-600 animate-bounce" />
              <span className="text-emerald-700">Data Updated</span>
            </>
          ) : isRefreshing ? (
            <>
              <RotateCw size={15} className="text-[#6338DF] animate-spin" />
              <span className="text-gray-800">Refreshing HRMS data...</span>
            </>
          ) : (
            <>
              <div
                className="w-5 h-5 rounded-full bg-purple-50 flex items-center justify-center text-[#6338DF] transition-transform duration-150"
                style={{
                  transform: `rotate(${isReadyToRelease ? 180 : pullProgress * 140}deg)`,
                }}
              >
                <ArrowDown size={13} />
              </div>
              <span className={isReadyToRelease ? 'text-[#6338DF] font-bold' : 'text-gray-500'}>
                {isReadyToRelease ? 'Release to refresh' : 'Pull down to refresh'}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Content wrapper with subtle downward translation while pulling */}
      <div
        className="transition-transform ease-out"
        style={{
          transform: isPulling ? `translateY(${pullDistance * 0.35}px)` : 'none',
          transitionDuration: isPulling ? '0ms' : '250ms',
        }}
      >
        {children}
      </div>
    </div>
  );
};
