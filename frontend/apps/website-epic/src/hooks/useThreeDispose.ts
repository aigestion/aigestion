import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Hook para optimizar Three.js con dispose() automático
 * Libera memoria de objetos 3D cuando el componente se desmonta
 */
export function useThreeDispose() {
  const disposablesRef = useRef<{
    geometries: THREE.BufferGeometry[];
    materials: THREE.Material[];
    textures: THREE.Texture[];
    renderTargets: THREE.WebGLRenderTarget[];
    objects: THREE.Object3D[];
  }>({
    geometries: [],
    materials: [],
    textures: [],
    renderTargets: [],
    objects: [],
  });

  const addGeometry = (geometry: THREE.BufferGeometry) => {
    disposablesRef.current.geometries.push(geometry);
  };

  const addMaterial = (material: THREE.Material) => {
    disposablesRef.current.materials.push(material);
  };

  const addTexture = (texture: THREE.Texture) => {
    disposablesRef.current.textures.push(texture);
  };

  const addRenderTarget = (renderTarget: THREE.WebGLRenderTarget) => {
    disposablesRef.current.renderTargets.push(renderTarget);
  };

  const addObject = (object: THREE.Object3D) => {
    disposablesRef.current.objects.push(object);
  };

  const disposeObject = (object: THREE.Object3D) => {
    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.geometry) {
          child.geometry.dispose();
        }
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(material => material.dispose());
          } else {
            child.material.dispose();
          }
        }
      }
    });
  };

  useEffect(() => {
    return () => {
      // Dispose all geometries
      disposablesRef.current.geometries.forEach(geometry => {
        geometry.dispose();
      });

      // Dispose all materials
      disposablesRef.current.materials.forEach(material => {
        material.dispose();
      });

      // Dispose all textures
      disposablesRef.current.textures.forEach(texture => {
        texture.dispose();
      });

      // Dispose all render targets
      disposablesRef.current.renderTargets.forEach(renderTarget => {
        renderTarget.dispose();
      });

      // Dispose all objects recursively
      disposablesRef.current.objects.forEach(object => {
        disposeObject(object);
      });

      // Clear arrays
      disposablesRef.current.geometries = [];
      disposablesRef.current.materials = [];
      disposablesRef.current.textures = [];
      disposablesRef.current.renderTargets = [];
      disposablesRef.current.objects = [];
    };
  }, []);

  return {
    addGeometry,
    addMaterial,
    addTexture,
    addRenderTarget,
    addObject,
    disposeObject,
  };
}

/**
 * Hook para dispose automático de escenas Three.js
 */
export function useSceneDispose(scene: THREE.Scene | null) {
  useEffect(() => {
    return () => {
      if (scene) {
        // Remove all objects from scene
        while(scene.children.length > 0) {
          const object = scene.children[0];
          scene.remove(object);
          
          // Dispose the object
          if (object instanceof THREE.Mesh) {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach(material => material.dispose());
              } else {
                object.material.dispose();
              }
            }
          }
        }
      }
    };
  }, [scene]);
}

/**
 * Hook para dispose de renderers Three.js
 */
export function useRendererDispose(renderer: THREE.WebGLRenderer | null) {
  useEffect(() => {
    return () => {
      if (renderer) {
        renderer.dispose();
        renderer.forceContextLoss();
      }
    };
  }, [renderer]);
}
