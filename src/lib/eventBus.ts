/**
 * Event Bus — Decoupled Scene ↔ UI Communication
 * ARCHITECTURE-v2.md §8 Layer C ↔ Layer B communication via Context + Events
 * ARCHITECTURE-v2.md §9 Interaction Patterns
 *
 * Single event bus for the entire app. Layer C (scene) emits, Layer B (UI) subscribes,
 * and vice versa. No prop drilling, no direct imports across layers.
 */

import { useEffect, type DependencyList } from 'react';

export type SceneEventMap = {
  // Section navigation
  'scene:sectionChange': {
    section: string;
    direction: 'down' | 'up';
    velocity: number;
    progress: number;
  };

  // Object interaction
  'scene:objectHover': {
    object: {
      id: string;
      type: string;
      name: string;
      burstOnHover?: boolean;
      position?: { x: number; y: number; z: number };
    };
    distance: number;
  };
  'scene:objectClick': {
    object: {
      id: string;
      type: string;
      name: string;
      action?: string;
      data?: Record<string, unknown>;
    };
    point: { x: number; y: number; z: number };
  };
  'scene:objectFocus': {
    object: {
      id: string;
      type: string;
      name: string;
    };
    duration: number;
  };

  // Diary / page interactions
  'scene:pageTurn': {
    direction: 'forward' | 'backward';
    pageIndex: number;
    spreadIndex: number;
  };
  'scene:diaryStateChange': {
    state: 'closed' | 'opening' | 'open' | 'closing';
    chapter?: string;
  };

  // Particle / visual effects
  'scene:particleBurst': {
    type: 'ember' | 'dust' | 'ink' | 'mystery';
    position: { x: number; y: number; z: number };
    count: number;
    color?: number;
  };
  'scene:glowPulse': {
    target: string;
    color: number;
    intensity: number;
    duration: number;
  };

  // Artifact / mystery discovery
  'scene:artifactReveal': {
    artifactId: string;
    artifactType: 'key' | 'compass' | 'scroll' | 'mystery';
    position: { x: number; y: number; z: number };
  };
  'scene:mysteryTrigger': {
    triggerId: string;
    intensity: number;
  };

  // Camera
  'scene:cameraMove': {
    position: { x: number; y: number; z: number };
    lookAt: { x: number; y: number; z: number };
    duration: number;
  };
  'scene:cameraFocus': {
    target: { x: number; y: number; z: number };
    duration: number;
    onComplete?: () => void;
  };

  // Audio cues
  'scene:audioCue': {
    sound: 'pageTurn' | 'brassClick' | 'emberWhoosh' | 'inkScratch' | 'hoverGlow' | 'openDiary' | 'closeDiary' | 'success';
    volume?: number;
  };
};

export type UIEventMap = {
  // UI → Scene commands
  'ui:scrollToSection': {
    section: string;
    smooth?: boolean;
  };
  'ui:openDiary': void;
  'ui:closeDiary': void;
  'ui:goToChapter': {
    chapter: string;
  };
  'ui:openProject': {
    projectId: string;
  };
  'ui:closeProject': void;

  // Camera control from UI
  'ui:cameraFocus': {
    target: { x: number; y: number; z: number };
    duration?: number;
  };
  'ui:cameraReset': void;

  // Settings / preferences
  'ui:toggle3D': {
    enabled: boolean;
  };
  'ui:setReducedMotion': {
    enabled: boolean;
  };
  'ui:setDeviceTier': {
    tier: 1 | 2 | 3;
  };

  // Audio
  'ui:playSound': {
    sound: 'pageTurn' | 'brassClick' | 'emberWhoosh' | 'inkScratch' | 'hoverGlow' | 'openDiary' | 'closeDiary' | 'success';
    volume?: number;
  };
  'ui:setVolume': {
    volume: number;
  };
  'ui:setMuted': {
    muted: boolean;
  };
};

// Unified event map
export type EventMap = SceneEventMap & UIEventMap;

type EventCallback<T> = (detail: T) => void;
type Unsubscribe = () => void;

function isThenable<T>(value: T | PromiseLike<T>): value is PromiseLike<T> {
  return value !== null && typeof value === 'object' && 'then' in value;
}

class EventBus {
  private listeners = new Map<keyof EventMap, Set<EventCallback<any>>>();
  private debug = false;

  /**
   * Enable debug logging
   */
  setDebug(enabled: boolean) {
    this.debug = enabled;
  }

  /**
   * Subscribe to an event
   */
  on<K extends keyof EventMap>(event: K, callback: EventCallback<EventMap[K]>): Unsubscribe {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    if (this.debug) {
      console.log(`[EventBus] Subscribed: ${event}`);
    }

    return () => {
      this.off(event, callback);
    };
  }

  /**
   * Subscribe once, then auto-unsubscribe
   */
  once<K extends keyof EventMap>(event: K, callback: EventCallback<EventMap[K]>): Unsubscribe {
    const wrapped = (detail: EventMap[K]) => {
      callback(detail);
      this.off(event, wrapped);
    };
    return this.on(event, wrapped);
  }

  /**
   * Unsubscribe from an event
   */
  off<K extends keyof EventMap>(event: K, callback: EventCallback<EventMap[K]>): void {
    const set = this.listeners.get(event);
    if (set) {
      set.delete(callback);
      if (set.size === 0) {
        this.listeners.delete(event);
      }
    }
  }

  /**
   * Emit an event to all subscribers
   */
  emit<K extends keyof EventMap>(event: K, detail: EventMap[K]): void {
    const set = this.listeners.get(event);
    if (!set || set.size === 0) {
      if (this.debug) {
        console.log(`[EventBus] No listeners for: ${event}`);
      }
      return;
    }

    if (this.debug) {
      console.log(`[EventBus] Emitting: ${event}`, detail);
    }

    set.forEach((callback) => {
      try {
        callback(detail);
      } catch (error) {
        console.error(`[EventBus] Error in listener for ${event}:`, error);
      }
    });
  }

  /**
   * Emit and await all async callbacks
   */
  async emitAsync<K extends keyof EventMap>(event: K, detail: EventMap[K]): Promise<void> {
    const set = this.listeners.get(event);
    if (!set || set.size === 0) return;

    const promises = Array.from(set).map((callback) => {
      try {
        const result = callback(detail);
        return isThenable(result) ? result : Promise.resolve();
      } catch (error) {
        console.error(`[EventBus] Async error in listener for ${event}:`, error);
        return Promise.resolve();
      }
    });

    await Promise.all(promises);
  }

  /**
   * Clear all listeners (for cleanup/testing)
   */
  clear(): void {
    this.listeners.clear();
  }

  /**
   * Get listener count for an event
   */
  listenerCount(event: keyof EventMap): number {
    return this.listeners.get(event)?.size ?? 0;
  }

  /**
   * List all events with listeners
   */
  listEvents(): string[] {
    return Array.from(this.listeners.keys());
  }
}

// Singleton instance
export const eventBus = new EventBus();

// Convenience hooks for React components
export function useSceneEvent<K extends keyof SceneEventMap>(
  event: K,
  handler: (detail: SceneEventMap[K]) => void,
  deps: DependencyList = []
) {
  useEffect(() => {
    return eventBus.on(event, handler);
  }, [event, ...deps]);
}

export function useUIEvent<K extends keyof UIEventMap>(
  event: K,
  handler: (detail: UIEventMap[K]) => void,
  deps: DependencyList = []
) {
  useEffect(() => {
    return eventBus.on(event, handler);
  }, [event, ...deps]);
}

// Typed emit helpers
export const emitScene = {
  sectionChange: (detail: SceneEventMap['scene:sectionChange']) => eventBus.emit('scene:sectionChange', detail),
  objectHover: (detail: SceneEventMap['scene:objectHover']) => eventBus.emit('scene:objectHover', detail),
  objectClick: (detail: SceneEventMap['scene:objectClick']) => eventBus.emit('scene:objectClick', detail),
  objectFocus: (detail: SceneEventMap['scene:objectFocus']) => eventBus.emit('scene:objectFocus', detail),
  pageTurn: (detail: SceneEventMap['scene:pageTurn']) => eventBus.emit('scene:pageTurn', detail),
  diaryStateChange: (detail: SceneEventMap['scene:diaryStateChange']) => eventBus.emit('scene:diaryStateChange', detail),
  particleBurst: (detail: SceneEventMap['scene:particleBurst']) => eventBus.emit('scene:particleBurst', detail),
  glowPulse: (detail: SceneEventMap['scene:glowPulse']) => eventBus.emit('scene:glowPulse', detail),
  artifactReveal: (detail: SceneEventMap['scene:artifactReveal']) => eventBus.emit('scene:artifactReveal', detail),
  mysteryTrigger: (detail: SceneEventMap['scene:mysteryTrigger']) => eventBus.emit('scene:mysteryTrigger', detail),
  cameraMove: (detail: SceneEventMap['scene:cameraMove']) => eventBus.emit('scene:cameraMove', detail),
  cameraFocus: (detail: SceneEventMap['scene:cameraFocus']) => eventBus.emit('scene:cameraFocus', detail),
  audioCue: (detail: SceneEventMap['scene:audioCue']) => eventBus.emit('scene:audioCue', detail),
};

export const emitUI = {
  scrollToSection: (detail: UIEventMap['ui:scrollToSection']) => eventBus.emit('ui:scrollToSection', detail),
  openDiary: () => eventBus.emit('ui:openDiary', undefined),
  closeDiary: () => eventBus.emit('ui:closeDiary', undefined),
  goToChapter: (detail: UIEventMap['ui:goToChapter']) => eventBus.emit('ui:goToChapter', detail),
  openProject: (detail: UIEventMap['ui:openProject']) => eventBus.emit('ui:openProject', detail),
  closeProject: () => eventBus.emit('ui:closeProject', undefined),
  cameraFocus: (detail: UIEventMap['ui:cameraFocus']) => eventBus.emit('ui:cameraFocus', detail),
  cameraReset: () => eventBus.emit('ui:cameraReset', undefined),
  toggle3D: (detail: UIEventMap['ui:toggle3D']) => eventBus.emit('ui:toggle3D', detail),
  setReducedMotion: (detail: UIEventMap['ui:setReducedMotion']) => eventBus.emit('ui:setReducedMotion', detail),
  setDeviceTier: (detail: UIEventMap['ui:setDeviceTier']) => eventBus.emit('ui:setDeviceTier', detail),
  playSound: (detail: UIEventMap['ui:playSound']) => eventBus.emit('ui:playSound', detail),
  setVolume: (detail: UIEventMap['ui:setVolume']) => eventBus.emit('ui:setVolume', detail),
  setMuted: (detail: UIEventMap['ui:setMuted']) => eventBus.emit('ui:setMuted', detail),
};

export default eventBus;