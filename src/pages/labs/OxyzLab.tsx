import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Maximize, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function OxyzLab({ onBack }: { onBack: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Refs for three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);

  const fitCameraToObject = () => {
    if (!cameraRef.current || !controlsRef.current || !modelGroupRef.current || !containerRef.current) return;
    
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    const group = modelGroupRef.current;
    
    const box = new THREE.Box3().setFromObject(group);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    
    const maxSize = Math.max(size.x, size.y, size.z);
    const fitHeightDistance = maxSize / (2 * Math.atan((Math.PI * camera.fov) / 360));
    const fitWidthDistance = fitHeightDistance / camera.aspect;
    const distance = 1.35 * Math.max(fitHeightDistance, fitWidthDistance);
    
    const direction = controls.target.clone().sub(camera.position).normalize().multiplyScalar(distance);
    
    controls.maxDistance = distance * 10;
    controls.target.copy(center);
    
    camera.near = distance / 100;
    camera.far = distance * 100;
    camera.updateProjectionMatrix();
    
    // Set position to a nice angle
    camera.position.set(center.x + distance * 0.5, center.y + distance * 0.4, center.z + distance * 0.8);
    camera.lookAt(center);
    
    controls.update();
  };

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // Init Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8fafc); // slate-50
    sceneRef.current = scene;

    // Init Camera
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    cameraRef.current = camera;

    // Init Renderer
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // Init Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    // Build Model: Pyramid S.ABCD
    const group = new THREE.Group();
    modelGroupRef.current = group;
    scene.add(group);

    const a = 4; // base side
    const h = 6; // height
    const sPos = new THREE.Vector3(0, h, 0);
    const aPos = new THREE.Vector3(-a/2, 0, a/2);
    const bPos = new THREE.Vector3(a/2, 0, a/2);
    const cPos = new THREE.Vector3(a/2, 0, -a/2);
    const dPos = new THREE.Vector3(-a/2, 0, -a/2);

    // Create Base
    const baseGeo = new THREE.BufferGeometry().setFromPoints([aPos, bPos, cPos, dPos, aPos]);
    const lineMat = new THREE.LineBasicMaterial({ color: 0x4f46e5, linewidth: 2 });
    const baseLines = new THREE.Line(baseGeo, lineMat);
    group.add(baseLines);

    // Create Edges
    const edgePoints = [
      sPos, aPos, sPos, bPos, sPos, cPos, sPos, dPos
    ];
    const edgeGeo = new THREE.BufferGeometry().setFromPoints(edgePoints);
    const edgeLines = new THREE.LineSegments(edgeGeo, lineMat);
    group.add(edgeLines);

    // Add labels
    const createLabel = (text: string, pos: THREE.Vector3) => {
      const canvas = document.createElement('canvas');
      canvas.width = 64; canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#172033';
        ctx.font = 'bold 32px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 32, 32);
      }
      const tex = new THREE.CanvasTexture(canvas);
      const spriteMat = new THREE.SpriteMaterial({ map: tex, sizeAttenuation: false, depthTest: false });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.position.copy(pos);
      // Offset slightly
      if(text === 'S') sprite.position.y += 0.5;
      else sprite.position.y -= 0.5;
      sprite.scale.set(0.05, 0.05, 0.05);
      return sprite;
    };
    group.add(createLabel('S', sPos));
    group.add(createLabel('A', aPos));
    group.add(createLabel('B', bPos));
    group.add(createLabel('C', cPos));
    group.add(createLabel('D', dPos));

    // Axes helper
    const axesHelper = new THREE.AxesHelper(3);
    group.add(axesHelper);

    // Resize Handler
    const resizeObserver = new ResizeObserver(entries => {
      if (entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      if (width === 0 || height === 0) return;
      
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      
      // Initial fit if not done yet
      if (!camera.userData.fitted) {
        fitCameraToObject();
        camera.userData.fitted = true;
      }
    });
    resizeObserver.observe(containerRef.current);

    // Animation Loop
    let reqId: number;
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(reqId);
      resizeObserver.disconnect();
      renderer.dispose();
      baseGeo.dispose();
      edgeGeo.dispose();
      lineMat.dispose();
    };
  }, []);

  const handleReset = () => {
    fitCameraToObject();
  };

  const handleZoomIn = () => {
    if (cameraRef.current && controlsRef.current) {
      const zoom = 0.8;
      const cam = cameraRef.current;
      cam.position.lerp(controlsRef.current.target, 1 - zoom);
      controlsRef.current.update();
    }
  };

  const handleZoomOut = () => {
    if (cameraRef.current && controlsRef.current) {
      const zoom = 1.25;
      const cam = cameraRef.current;
      const dir = cam.position.clone().sub(controlsRef.current.target);
      cam.position.copy(controlsRef.current.target).add(dir.multiplyScalar(zoom));
      controlsRef.current.update();
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error("Lỗi fullscreen:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  return (
    <div className="flex flex-col h-auto min-h-fit bg-white rounded-2xl shadow-sm border border-slate-200 overflow-visible">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-4 flex-wrap sticky top-0 bg-white z-10 rounded-t-2xl">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors shrink-0">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-bold text-slate-800 shrink-0">Phòng Lab Oxyz</h2>
        </div>
      </div>
      
      <div className="p-4 md:p-8 flex flex-col gap-8">
        <div className="max-w-3xl mx-auto w-full space-y-4">
          <div className="text-center">
            <h3 className="text-xl font-bold text-slate-800">Mô phỏng không gian Oxyz</h3>
            <p className="text-slate-600 mt-2">Trực quan hóa khối chóp S.ABCD trong không gian 3 chiều. Sử dụng chuột hoặc ngón tay để tương tác.</p>
          </div>
          
          <div 
            ref={containerRef} 
            className={`relative bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-inner flex flex-col ${isFullscreen ? 'h-screen w-screen' : 'w-full min-h-[420px] h-[55vh] md:min-h-[520px] md:h-[min(65vh,680px)]'}`}
          >
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
              <button onClick={handleReset} className="p-2 bg-white/90 backdrop-blur rounded-lg shadow-sm border border-slate-200 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors" title="Đặt lại góc nhìn">
                <RotateCcw size={20} />
              </button>
              <button onClick={handleZoomIn} className="p-2 bg-white/90 backdrop-blur rounded-lg shadow-sm border border-slate-200 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors" title="Phóng to">
                <ZoomIn size={20} />
              </button>
              <button onClick={handleZoomOut} className="p-2 bg-white/90 backdrop-blur rounded-lg shadow-sm border border-slate-200 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors" title="Thu nhỏ">
                <ZoomOut size={20} />
              </button>
              <button onClick={toggleFullscreen} className="p-2 bg-white/90 backdrop-blur rounded-lg shadow-sm border border-slate-200 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors" title="Toàn màn hình">
                <Maximize size={20} />
              </button>
            </div>
            <canvas 
              ref={canvasRef} 
              className="w-full h-full block touch-none" 
              style={{ touchAction: 'none', outline: 'none' }}
            />
          </div>
          
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-sm text-blue-800">
            <p className="font-semibold mb-1">💡 Hướng dẫn tương tác:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Xoay mô hình:</strong> Nhấn giữ chuột trái và kéo (hoặc vuốt 1 ngón tay).</li>
              <li><strong>Phóng to/Thu nhỏ:</strong> Lăn chuột (hoặc dùng 2 ngón tay chụm/mở).</li>
              <li><strong>Di chuyển:</strong> Nhấn giữ chuột phải và kéo (hoặc dùng 2 ngón tay vuốt cùng lúc).</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
