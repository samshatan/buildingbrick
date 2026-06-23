import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, RoundedBox } from '@react-three/drei';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import * as THREE from 'three';

// Procedural Brick House Representation
function HouseModel({ brickColor, roofingColor }: { brickColor: string, roofingColor: string }) {
  const wallMaterial = new THREE.MeshStandardMaterial({ 
    color: brickColor,
    roughness: 0.8,
    bumpScale: 0.02
  });

  const roofMaterial = new THREE.MeshStandardMaterial({ 
    color: roofingColor,
    roughness: 0.9,
  });

  return (
    <group position={[0, -1, 0]}>
      {/* Main Building Frame */}
      <mesh castShadow receiveShadow position={[0, 1.5, 0]} material={wallMaterial}>
        <boxGeometry args={[4, 3, 3]} />
      </mesh>
      
      {/* Front extension/Garage */}
      <mesh castShadow receiveShadow position={[1, 1, 1.5]} material={wallMaterial}>
        <boxGeometry args={[2, 2, 2]} />
      </mesh>

      {/* Roof Main */}
      <mesh castShadow receiveShadow position={[0, 3.5, 0]}>
        <coneGeometry args={[3.2, 1.5, 4]} />
        <meshStandardMaterial color={roofingColor} roughness={0.8} />
      </mesh>
      <group position={[0, 3.5, 0]} rotation={[0, Math.PI / 4, 0]}>
        <mesh castShadow receiveShadow material={roofMaterial}>
          <coneGeometry args={[3.2, 1.5, 4]} />
        </mesh>
      </group>

      {/* Door */}
      <mesh position={[-0.8, 0.8, 1.51]}>
        <planeGeometry args={[0.8, 1.6]} />
        <meshStandardMaterial color="#2d2d2d" />
      </mesh>

      {/* Garage Door */}
      <mesh position={[1, 0.9, 2.51]}>
        <planeGeometry args={[1.5, 1.8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      {/* Window */}
      <mesh position={[-1, 1.5, 1.51]}>
        <planeGeometry args={[0.8, 1]} />
        <meshStandardMaterial color="#1f4e79" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Grass/Base */}
      <mesh receiveShadow position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[15, 15]} />
        <meshStandardMaterial color="#4a7c59" />
      </mesh>
    </group>
  );
}

export default function StudioScreen() {
  const [brickStyle, setBrickStyle] = useState(() => {
    return localStorage.getItem('budgetEstimator_brickStyle') || '#cc4518';
  });
  const [roofStyle, setRoofStyle] = useState(() => {
    return localStorage.getItem('budgetEstimator_roofStyle') || '#1a1a1a';
  });
  const [sqft, setSqft] = useState(() => {
    const saved = localStorage.getItem('budgetEstimator_sqft');
    return saved ? parseInt(saved, 10) : 2500;
  });

  useEffect(() => {
    localStorage.setItem('budgetEstimator_brickStyle', brickStyle);
    localStorage.setItem('budgetEstimator_roofStyle', roofStyle);
    localStorage.setItem('budgetEstimator_sqft', sqft.toString());
  }, [brickStyle, roofStyle, sqft]);

  const brickPresets = [
    { name: 'Classic Red', color: '#cc4518', price: 8 },
    { name: 'Weathered', color: '#965a3e', price: 10 },
    { name: 'Modern White', color: '#f0f0f0', price: 12 },
    { name: 'Charcoal', color: '#333333', price: 11 }
  ];

  const roofPresets = [
    { name: 'Slate Black', color: '#1a1a1a', price: 6 },
    { name: 'Navy Blue', color: '#1b2a47', price: 7 },
    { name: 'Terracotta', color: '#9e4624', price: 9 }
  ];

  const selectedBrick = brickPresets.find(p => p.color === brickStyle) || brickPresets[0];
  const selectedRoof = roofPresets.find(p => p.color === roofStyle) || roofPresets[0];

  const materialCost = (selectedBrick.price + selectedRoof.price) * sqft;
  const laborCost = 25 * sqft;
  const totalCost = materialCost + laborCost;

  return (
    <div className="flex flex-col h-full bg-zinc-50 relative">
      <div className="absolute top-8 left-0 right-0 z-10 px-6 flex justify-between items-center pointer-events-none">
        <h2 className="text-2xl font-display font-medium text-zinc-900 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-sm border border-zinc-100">
          3D Designer
        </h2>
        <div className="bg-white/80 backdrop-blur-md p-3.5 rounded-full shadow-sm pointer-events-auto cursor-pointer border border-zinc-100 hover:bg-white transition-colors" onClick={() => {
           setBrickStyle('#cc4518');
           setRoofStyle('#1a1a1a');
        }}>
          <RefreshCw size={20} className="text-zinc-700" />
        </div>
      </div>

      {/* 3D Canvas Viewport */}
      <div className="h-[55%] w-full bg-transparent">
        <Canvas shadows camera={{ position: [5, 4, 8], fov: 45 }}>
          <Environment preset="city" />
          <ambientLight intensity={0.4} />
          <directionalLight castShadow position={[5, 10, 5]} intensity={1.5} shadow-mapSize={[1024, 1024]} />
          
          <HouseModel brickColor={brickStyle} roofingColor={roofStyle} />
          
          <ContactShadows resolution={1024} scale={20} blur={2} opacity={0.5} far={10} color="#000000" />
          <OrbitControls 
            enablePan={false} 
            minPolarAngle={Math.PI / 4} 
            maxPolarAngle={Math.PI / 2.1} 
            minDistance={4}
            maxDistance={12}
            target={[0, 0, 0]}
          />
        </Canvas>
      </div>

      {/* Controls Container */}
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="flex-1 bg-white rounded-t-[40px] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] border-t border-zinc-100 relative z-20 px-6 py-6 overflow-y-auto"
      >
        <div className="w-16 h-1 bg-zinc-200 rounded-full mx-auto mb-8"></div>
        
        {/* Material Selectors */}
        <div className="space-y-8 pb-24">
          <div>
            <h3 className="text-[10px] font-bold text-zinc-400 mb-4 uppercase tracking-[0.2em]">Wall Material</h3>
            <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
              {brickPresets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => setBrickStyle(preset.color)}
                  className={`flex-shrink-0 flex flex-col items-center gap-3 transition-transform active:scale-95`}
                >
                  <div 
                    className={`w-16 h-16 rounded-full shadow-sm border-4 ${brickStyle === preset.color ? 'border-primary-500 scale-105' : 'border-white ring-1 ring-zinc-100'}`}
                    style={{ backgroundColor: preset.color }}
                  />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-bold text-zinc-400 mb-4 uppercase tracking-[0.2em]">Roofing Style</h3>
            <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
              {roofPresets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => setRoofStyle(preset.color)}
                  className={`flex-shrink-0 flex flex-col items-center gap-3 transition-transform active:scale-95`}
                >
                  <div 
                    className={`w-16 h-16 rounded-full shadow-sm border-4 ${roofStyle === preset.color ? 'border-zinc-900 scale-105' : 'border-white ring-1 ring-zinc-100'}`}
                    style={{ backgroundColor: preset.color }}
                  />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Budget Estimator */}
          <div className="pt-8 border-t border-zinc-100">
            <div className="flex justify-between items-end mb-4">
              <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Estimated Budget</h3>
              <div className="text-2xl font-display font-medium text-primary-500">
                ${totalCost.toLocaleString()}
              </div>
            </div>
            
            <div className="bg-zinc-50 rounded-[24px] p-6 border border-zinc-100 flex flex-col gap-6">
               <div>
                  <div className="flex justify-between text-xs font-bold text-zinc-700 mb-4 uppercase tracking-widest">
                     <span>Estimated Area</span>
                     <span>{sqft} sq ft</span>
                  </div>
                  <input 
                    type="range" 
                    min="1000" max="6000" step="100" 
                    value={sqft}
                    onChange={(e) => setSqft(Number(e.target.value))}
                    className="w-full accent-primary-500 h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer"
                  />
               </div>
               <div className="flex flex-col gap-3 pt-4 border-t border-zinc-200/50">
                  <div className="flex justify-between text-xs text-zinc-500 font-medium">
                     <span>Material Cost ({selectedBrick.name} & {selectedRoof.name})</span>
                     <span className="text-zinc-900 font-bold">${materialCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs text-zinc-500 font-medium">
                     <span>Estimated Labor</span>
                     <span className="text-zinc-900 font-bold">${laborCost.toLocaleString()}</span>
                  </div>
               </div>
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
