import { useSceneSync } from '../lib/useSceneSync';

/**
 * SceneSync — Connects the useSceneSync hook to the 3D scene.
 *
 * This component bridges scroll position to the 3D camera, triggers particle
 * bursts, and highlights objects. It renders nothing — it only runs hooks
 * that emit events via the eventBus for CameraRig and effects to consume.
 *
 * ARCHITECTURE-v2 §3.3: useSceneSync — Subscribe to ScrollContext, drive CameraRig
 */
export default function SceneSync() {
  // useSceneSync subscribes to scroll progress and emits cameraMove events
  // via the eventBus. CameraRig listens for these events.
  useSceneSync();
  return null;
}
