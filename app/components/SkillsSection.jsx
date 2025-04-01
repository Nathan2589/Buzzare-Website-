"use client";
import { useState, useRef, useEffect } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import { retroFont, synthFont } from "../fonts";

export default function SkillsSection() {
  const ref = useRef(null);
  const graphRef = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const controls = useAnimation();
  const [activeNode, setActiveNode] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const [angle, setAngle] = useState(0);
  
  // Nodes with z-index (depth) for 3D effect
  const nodes = [
    { id: "3d-modeling", name: "3D Modeling", group: 1, x: 0.3, y: 0.3, z: 0.2 },
    { id: "animation", name: "Animation", group: 1, x: 0.7, y: 0.3, z: 0.1 },
    { id: "rigging", name: "Rigging", group: 1, x: 0.5, y: 0.5, z: 0.3 },
    { id: "texturing", name: "Texturing", group: 1, x: 0.2, y: 0.6, z: 0.4 },
    { id: "lighting", name: "Lighting", group: 2, x: 0.6, y: 0.7, z: 0.5 },
    { id: "rendering", name: "Rendering", group: 2, x: 0.8, y: 0.6, z: 0.2 },
    { id: "compositing", name: "Compositing", group: 2, x: 0.4, y: 0.8, z: 0.1 },
    { id: "vfx", name: "VFX", group: 2, x: 0.7, y: 0.8, z: 0.3 },
    { id: "motion-capture", name: "Motion Design", group: 3, x: 0.3, y: 0.2, z: 0.2 },
    { id: "storyboarding", name: "Storyboarding", group: 3, x: 0.1, y: 0.4, z: 0.4 },
    { id: "blender", name: "Blender", group: 4, x: 0.2, y: 0.8, z: 0.5 },
    { id: "cinema4d", name: "Cinema 4D", group: 4, x: 0.9, y: 0.2, z: 0.1 },
    { id: "after-effects", name: "After Effects", group: 4, x: 0.9, y: 0.8, z: 0.3 },
    { id: "substance", name: "Substance", group: 4, x: 0.1, y: 0.7, z: 0.4 },
  ];

  const links = [
    { source: "3d-modeling", target: "animation" },
    { source: "3d-modeling", target: "texturing" },
    { source: "3d-modeling", target: "rigging" },
    { source: "3d-modeling", target: "blender" },
    { source: "3d-modeling", target: "cinema4d" },
    { source: "animation", target: "rigging" },
    { source: "animation", target: "motion-design" },
    { source: "animation", target: "blender" },
    { source: "animation", target: "after-effects" },
    { source: "rigging", target: "blender" },
    { source: "texturing", target: "lighting" },
    { source: "texturing", target: "substance" },
    { source: "lighting", target: "rendering" },
    { source: "rendering", target: "compositing" },
    { source: "compositing", target: "vfx" },
    { source: "compositing", target: "after-effects" },
    { source: "vfx", target: "after-effects" },
    { source: "motion-design", target: "after-effects" },
    { source: "motion-design", target: "storyboarding" },
  ];

  // Get node color based on group with stronger neon effect
  const getNodeColor = (group, opacity = 0.8) => {
    switch(group) {
      case 1: return `rgba(255, 0, 255, ${opacity})`; // Neon Pink
      case 2: return `rgba(0, 255, 255, ${opacity})`; // Neon Cyan
      case 3: return `rgba(255, 255, 0, ${opacity})`; // Neon Yellow
      case 4: return `rgba(255, 85, 0, ${opacity})`; // Neon Orange
      default: return `rgba(255, 255, 255, ${opacity})`;
    }
  };

  // Get node's related connections
  const getRelatedNodes = (nodeId) => {
    return links
      .filter(link => link.source === nodeId || link.target === nodeId)
      .map(link => link.source === nodeId ? link.target : link.source);
  };

  // Calculate 3D position with perspective
  const getProjectedPosition = (x, y, z, angle) => {
    // Apply gentle rotation for 3D effect
    const rotationFactor = 0.2; 
    const newX = x + Math.sin(angle) * z * rotationFactor;
    const newY = y + Math.cos(angle) * z * rotationFactor;
    
    // Calculate size based on z (perspective)
    const scale = 1 - z * 0.3; // Smaller scale for nodes that are "further away"
    
    return { x: newX, y: newY, scale };
  };

  // Light gentle rotation animation - optimized to use requestAnimationFrame
  useEffect(() => {
    if (!isInView) return;
    
    let animationId;
    let lastTimestamp = 0;
    const targetFps = 20; // Lower FPS for better performance
    const interval = 1000 / targetFps;
    
    const animate = (timestamp) => {
      if (timestamp - lastTimestamp >= interval) {
        setAngle(prevAngle => prevAngle + 0.01);
        lastTimestamp = timestamp;
      }
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isInView]);

  // Handle window resize while keeping aspect ratio
  useEffect(() => {
    const handleResize = () => {
      const container = document.querySelector('.skills-container');
      if (container) {
        const width = Math.min(1000, container.clientWidth); // Max width of 1000px
        const height = width * 0.6; // Maintain aspect ratio
        setDimensions({ width, height });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Start animation when in view
  useEffect(() => {
    if (isInView) {
      controls.start({ opacity: 1, y: 0 });
    }
  }, [isInView, controls]);

  return (
    <section ref={ref} className="py-20">
      <div className="container mx-auto px-4">
        <motion.h2 
          className={`${retroFont.className} text-4xl font-bold text-center mb-6 text-white`}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Skills Network
        </motion.h2>
        
        <motion.p 
          className={`${synthFont.className} text-center text-gray-300 max-w-2xl mx-auto mb-12`}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Explore how my skills interconnect to create comprehensive and engaging 3D animations
        </motion.p>
        
        <motion.div 
          className="skills-container backdrop-blur-sm bg-black/30 border border-[#ff00ff]/20 rounded-xl overflow-hidden mx-auto relative"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{ maxWidth: '1000px', height: `${dimensions.height}px` }}
          ref={graphRef}
        >
          <svg width={dimensions.width} height={dimensions.height} style={{ display: 'block', margin: '0 auto' }}>
            {/* Links between nodes */}
            {links.map((link, index) => {
              const sourceNode = nodes.find(n => n.id === link.source);
              const targetNode = nodes.find(n => n.id === link.target);
              
              if (!sourceNode || !targetNode) return null;
              
              const sourcePos = getProjectedPosition(
                sourceNode.x * dimensions.width, 
                sourceNode.y * dimensions.height, 
                sourceNode.z,
                angle
              );
              
              const targetPos = getProjectedPosition(
                targetNode.x * dimensions.width, 
                targetNode.y * dimensions.height, 
                targetNode.z,
                angle
              );
              
              const isActive = activeNode && 
                (activeNode === sourceNode.id || activeNode === targetNode.id);
              
              return (
                <line
                  key={`${sourceNode.id}-${targetNode.id}`}
                  x1={sourcePos.x}
                  y1={sourcePos.y}
                  x2={targetPos.x}
                  y2={targetPos.y}
                  stroke={isActive ? "#ff00ff" : "rgba(255, 0, 255, 0.15)"}
                  strokeWidth={isActive ? 2 : 1}
                  strokeOpacity={isActive ? 0.9 : 0.5}
                  className={isActive ? "active-link" : ""}
                />
              );
            })}
            
            {/* Nodes */}
            {nodes.map((node) => {
              const pos = getProjectedPosition(
                node.x * dimensions.width, 
                node.y * dimensions.height, 
                node.z,
                angle
              );
              
              const isActive = activeNode === node.id;
              const isRelated = activeNode && getRelatedNodes(activeNode).includes(node.id);
              const nodeSize = 12 * pos.scale; // Base size adjusted by scale
              const activeSize = isActive ? nodeSize * 1.5 : isRelated ? nodeSize * 1.3 : nodeSize;
              
              return (
                <g 
                  key={node.id}
                  className="cursor-pointer transition-all duration-300"
                  onClick={() => setActiveNode(isActive ? null : node.id)}
                  style={{ 
                    zIndex: Math.round((1 - node.z) * 100),
                    position: 'relative',
                  }}
                >
                  {/* Just one glow layer for better performance */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={activeSize * 2.5}
                    className={`node-glow-${node.group}`}
                    style={{ 
                      opacity: isActive ? 0.8 : isRelated ? 0.6 : 0.4 * (1 - node.z * 0.3),
                      transition: 'all 0.3s ease'
                    }}
                  />
                  
                  {/* Main node */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={activeSize}
                    fill={getNodeColor(node.group, 0.9)}
                    stroke={getNodeColor(node.group)}
                    strokeWidth="2"
                    className="node-main"
                  />
                  
                  {/* Label with black outline for better readability */}
                  <text
                    x={pos.x}
                    y={pos.y + activeSize + 15}
                    textAnchor="middle"
                    fill="white"
                    fontSize={12 * pos.scale}
                    fontWeight={isActive ? "bold" : "normal"}
                    className={synthFont.className}
                    style={{ 
                      textShadow: '0 0 4px rgba(0,0,0,0.8), 0 0 2px rgba(0,0,0,1), 0 0 1px rgba(0,0,0,1)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {node.name}
                  </text>
                </g>
              );
            })}
          </svg>
          
          {/* Overlay hint text */}
          <div className="absolute bottom-2 right-2 text-xs text-white/50">
            <span className={synthFont.className}>Click on skills to explore connections</span>
          </div>
        </motion.div>
        
        <motion.div 
          className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4 text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div>
            <div className="w-4 h-4 rounded-full bg-[#ff00ff] inline-block mr-2 shadow-[0_0_10px_rgba(255,0,255,0.7)]"></div>
            <span className={`${synthFont.className} text-white`}>Core 3D Skills</span>
          </div>
          <div>
            <div className="w-4 h-4 rounded-full bg-[#00ffff] inline-block mr-2 shadow-[0_0_10px_rgba(0,255,255,0.7)]"></div>
            <span className={`${synthFont.className} text-white`}>Rendering & VFX</span>
          </div>
          <div>
            <div className="w-4 h-4 rounded-full bg-[#ffff00] inline-block mr-2 shadow-[0_0_10px_rgba(255,255,0,0.7)]"></div>
            <span className={`${synthFont.className} text-white`}>Design Skills</span>
          </div>
          <div>
            <div className="w-4 h-4 rounded-full bg-[#ff5500] inline-block mr-2 shadow-[0_0_10px_rgba(255,85,0,0.7)]"></div>
            <span className={`${synthFont.className} text-white`}>Software Expertise</span>
          </div>
        </motion.div>
      </div>

      {/* CSS-based glow effects instead of SVG filters for better performance */}
      <style jsx>{`
        .node-glow-1 {
          fill: rgba(255, 0, 255, 0.2);
          filter: blur(8px);
        }
        .node-glow-2 {
          fill: rgba(0, 255, 255, 0.2);
          filter: blur(8px);
        }
        .node-glow-3 {
          fill: rgba(255, 255, 0, 0.2);
          filter: blur(8px);
        }
        .node-glow-4 {
          fill: rgba(255, 85, 0, 0.2);
          filter: blur(8px);
        }
        .node-main {
          filter: drop-shadow(0 0 3px currentColor);
        }
        .active-link {
          filter: drop-shadow(0 0 2px #ff00ff);
        }
      `}</style>
    </section>
  );
}