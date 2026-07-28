import { useRef, useEffect, useState, useCallback, createContext, useContext } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { usePortfolioStore } from '../../store/usePortfolioStore';
import { EMBER } from '../colors';

/**
 * 3D Keyboard Navigation System
 * Provides accessibility for 3D objects via keyboard (Tab/Arrow keys + Enter/Space)
 * Uses raycasting and a focus manager instead of DOM attributes on 3D objects
 */

interface FocusableObject {
  id: string;
  name: string;
  description: string;
  position: THREE.Vector3;
  onActivate: () => void;
  category?: string;
}

/**
 * Context for keyboard navigation
 */
interface KeyboardFocusContextValue {
  registerObject: (obj: FocusableObject) => void;
  unregisterObject: (id: string) => void;
  focusedIndex: number;
  focusedObject: FocusableObject | null;
  focusableObjects: FocusableObject[];
}

const KeyboardFocusContext = createContext<KeyboardFocusContextValue | null>(null);

export function useKeyboardFocusContext(): KeyboardFocusContextValue {
  const context = useContext(KeyboardFocusContext);
  if (!context) {
    throw new Error('useKeyboardFocusContext must be used within KeyboardNavigationProvider');
  }
  return context;
}

export function KeyboardNavigationProvider({ children }: { children: React.ReactNode }) {
  const { camera } = useThree();
  const { reducedMotion } = usePortfolioStore();
  const [focusableObjects, setFocusableObjects] = useState<FocusableObject[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  // Register a focusable object
  const registerObject = useCallback((obj: FocusableObject) => {
    setFocusableObjects(prev => {
      if (prev.some(o => o.id === obj.id)) return prev;
      return [...prev, obj];
    });
  }, []);

  // Unregister a focusable object
  const unregisterObject = useCallback((id: string) => {
    setFocusableObjects(prev => {
      const newList = prev.filter(o => o.id !== id);
      if (focusedIndex >= newList.length) {
        setFocusedIndex(newList.length - 1);
      }
      return newList;
    });
  }, [focusedIndex]);

  // Focus next/previous object
  const focusNext = useCallback(() => {
    if (focusableObjects.length === 0) return;
    const nextIndex = (focusedIndex + 1) % focusableObjects.length;
    setFocusedIndex(nextIndex);
    announceFocus(nextIndex);
  }, [focusableObjects, focusedIndex]);

  const focusPrevious = useCallback(() => {
    if (focusableObjects.length === 0) return;
    const prevIndex = (focusedIndex - 1 + focusableObjects.length) % focusableObjects.length;
    setFocusedIndex(prevIndex);
    announceFocus(prevIndex);
  }, [focusableObjects, focusedIndex]);

  const focusFirst = useCallback(() => {
    if (focusableObjects.length === 0) return;
    setFocusedIndex(0);
    announceFocus(0);
  }, [focusableObjects]);

  const focusLast = useCallback(() => {
    if (focusableObjects.length === 0) return;
    const lastIndex = focusableObjects.length - 1;
    setFocusedIndex(lastIndex);
    announceFocus(lastIndex);
  }, [focusableObjects]);

  const activateFocused = useCallback(() => {
    if (focusedIndex >= 0 && focusedIndex < focusableObjects.length) {
      focusableObjects[focusedIndex].onActivate();
    }
  }, [focusedIndex, focusableObjects]);

  // Announce focused object to screen readers
  const announceFocus = useCallback((index: number) => {
    const obj = focusableObjects[index];
    if (obj) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.style.position = 'absolute';
      announcement.style.left = '-9999px';
      announcement.textContent = `${obj.name}, ${obj.description}`;
      document.body.appendChild(announcement);
      setTimeout(() => announcement.remove(), 1000);
    }
  }, [focusableObjects]);

  // Handle global keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if we have focusable objects and user is not in an input
      const active = document.activeElement;
      if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || (active as HTMLElement).isContentEditable)) {
        return;
      }

      switch (e.key) {
        case 'Tab':
          if (focusableObjects.length === 0) return;
          e.preventDefault();
          if (e.shiftKey) {
            focusPrevious();
          } else {
            focusNext();
          }
          break;
        case 'ArrowDown':
        case 'ArrowRight':
          if (focusableObjects.length === 0) return;
          e.preventDefault();
          focusNext();
          break;
        case 'ArrowUp':
        case 'ArrowLeft':
          if (focusableObjects.length === 0) return;
          e.preventDefault();
          focusPrevious();
          break;
        case 'Home':
          if (focusableObjects.length === 0) return;
          e.preventDefault();
          focusFirst();
          break;
        case 'End':
          if (focusableObjects.length === 0) return;
          e.preventDefault();
          focusLast();
          break;
        case 'Enter':
        case ' ':
          if (focusedIndex >= 0) {
            e.preventDefault();
            activateFocused();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusableObjects, focusedIndex, focusNext, focusPrevious, focusFirst, focusLast, activateFocused]);

  // Visual indicator for focused 3D object (using a ring/marker)
  const focusedObject = focusedIndex >= 0 && focusedIndex < focusableObjects.length
    ? focusableObjects[focusedIndex]
    : null;

  // Create visual focus indicator
  useFrame(() => {
    if (!focusedObject || reducedMotion) return;
    // The focus ring is rendered via FocusRing component below
  });

  const contextValue = {
    registerObject,
    unregisterObject,
    focusedIndex,
    focusedObject,
    focusableObjects,
  };

  return (
    <>
      {children}
      {/* Global Focus Ring - rendered as HTML overlay */}
      {focusedObject && (
        <FocusRing
          objectPosition={focusedObject.position}
          camera={camera}
        />
      )}
      <KeyboardFocusContext.Provider value={contextValue}>
        {children}
      </KeyboardFocusContext.Provider>
    </>
  );
}

function FocusRing({
  objectPosition,
  camera,
}: {
  objectPosition: THREE.Vector3;
  camera: THREE.Camera;
}) {
  const { gl } = useThree();
  const [screenPos, setScreenPos] = useState({ x: 0, y: 0, visible: false });

  useFrame(() => {
    if (!gl) return;
    const vector = objectPosition.clone().project(camera);
    const x = (vector.x * 0.5 + 0.5) * gl.domElement.width;
    const y = (-vector.y * 0.5 + 0.5) * gl.domElement.height;
    const z = vector.z;

    // Only show if object is in front of camera
    setScreenPos({
      x,
      y,
      visible: z < 1 && z > -1,
    });
  });

  if (!screenPos.visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        left: screenPos.x - 24,
        top: screenPos.y - 24,
        width: 48,
        height: 48,
        pointerEvents: 'none',
        zIndex: 9999,
        border: `3px solid var(--border-glow, ${EMBER[400]})`,
        borderRadius: '50%',
        boxShadow: `0 0 20px -4px var(--border-glow, ${EMBER[400]}), 0 0 40px -8px var(--border-glow, ${EMBER[400]})`,
        animation: 'pulse-ring 2s ease-in-out infinite',
      }}
    >
      <style>{`
        @keyframes pulse-ring {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.2); opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}

/**
 * Hook to register a 3D object as keyboard focusable
 */
export function useKeyboardFocusable(
  id: string,
  name: string,
  description: string,
  position: THREE.Vector3,
  onActivate: () => void,
  category?: string
) {
  const { registerObject, unregisterObject } = useKeyboardFocusContext();
  const positionRef = useRef(position);

  useEffect(() => {
    positionRef.current = position;
    registerObject({ id, name, description, position: positionRef.current, onActivate, category });
    return () => unregisterObject(id);
  }, [id, name, description, onActivate, category, registerObject, unregisterObject]);
}

/**
 * Wrapper component for making 3D objects accessible
 * Creates an invisible HTML button overlay that syncs with 3D position
 */
interface AccessibleObjectProps {
  id: string;
  name: string;
  description: string;
  position: THREE.Vector3;
  onActivate: () => void;
  children: React.ReactNode;
  category?: string;
}

export function AccessibleObject({
  id,
  name,
  description,
  position,
  onActivate,
  children,
  category,
}: AccessibleObjectProps) {
  const { camera, gl } = useThree();
  const [screenPos, setScreenPos] = useState({ x: 0, y: 0, visible: false });
  const { registerObject, focusedObject, focusableObjects } = useKeyboardFocusContext();
  const positionRef = useRef(position);
  const indexRef = useRef(-1);

  // Register object and get its index
  useEffect(() => {
    positionRef.current = position;
    const obj = { id, name, description, position: positionRef.current, onActivate, category };
    registerObject(obj);
  }, [id, name, description, onActivate, category, registerObject]);

  // Update index when focusableObjects change
  useEffect(() => {
    indexRef.current = focusableObjects?.findIndex(o => o.id === id) ?? -1;
  }, [focusableObjects, id]);

  // Project 3D position to screen
  useFrame(() => {
    if (!camera || !gl) return;
    const vector = positionRef.current.clone().project(camera);
    const width = gl.domElement.width;
    const height = gl.domElement.height;
    const x = (vector.x * 0.5 + 0.5) * width;
    const y = (-vector.y * 0.5 + 0.5) * height;
    setScreenPos({ x, y, visible: vector.z < 1 && vector.z > -1 });
  });

  const isFocused = focusedObject?.id === id;

  // Hidden accessible button that follows the 3D object
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Sync focus state
  useEffect(() => {
    if (isFocused && buttonRef.current) {
      buttonRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      {children}
      {/* Accessible HTML button overlay */}
      {screenPos.visible && (
        <button
          ref={buttonRef}
          type="button"
          tabIndex={0}
          role="button"
          aria-label={name}
          aria-describedby={`${id}-desc`}
          aria-pressed={isFocused}
          onClick={onActivate}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onActivate();
            }
          }}
          onFocus={() => {
            if (indexRef.current >= 0) {
              // Focus is handled by keyboard navigation
            }
          }}
          style={{
            position: 'fixed',
            left: screenPos.x,
            top: screenPos.y,
            transform: 'translate(-50%, -50%)',
            width: '48px',
            height: '48px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            padding: 0,
            zIndex: 1000,
            outline: 'none',
            opacity: isFocused ? 1 : 0,
            pointerEvents: isFocused ? 'auto' : 'none',
          }}
        >
          <span id={`${id}-desc`} className="sr-only">{description}</span>
        </button>
      )}
    </>
  );
}