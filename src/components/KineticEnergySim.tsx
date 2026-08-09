import React, { useRef, useEffect, useState } from 'react';
import { UIStrings, KineticParticle, KineticSimSettings } from '../types';
import {
  Play,
  Pause,
  RotateCcw,
  Flame,
  Zap,
  Activity,
  BarChart3,
  Sliders,
  Thermometer,
  Gauge,
  Plus,
  Info,
} from 'lucide-react';

interface Props {
  t: UIStrings;
}

export const KineticEnergySim: React.FC<Props> = ({ t }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const graphCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Kinetic Simulation Settings
  const [settings, setSettings] = useState<KineticSimSettings>({
    temperatureK: 450,
    activationEnergyThreshold: 80,
    totalReactantParticles: 30,
    reactionEnthalpy: -120, // Exothermic
    isRunning: true,
    timeSpeed: 1,
  });

  // Reaction statistics
  const [reactantCount, setReactantCount] = useState<number>(30);
  const [productCount, setProductCount] = useState<number>(0);
  const [successfulCollisions, setSuccessfulCollisions] = useState<number>(0);
  const [reactionRate, setReactionRate] = useState<number>(0);

  // Particles state ref
  const particlesRef = useRef<KineticParticle[]>([]);
  const animFrameIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const reactionRateHistory = useRef<number[]>([]);

  // Initialize chamber particles
  const initParticles = (count: number) => {
    const newParticles: KineticParticle[] = [];
    const canvas = canvasRef.current;
    const width = canvas ? canvas.width : 600;
    const height = canvas ? canvas.height : 400;

    for (let i = 0; i < count; i++) {
      // Maxwell-Boltzmann speed distribution based on Temperature
      const speedScale = Math.sqrt(settings.temperatureK / 300) * (2 + Math.random() * 2);
      const angle = Math.random() * Math.PI * 2;

      newParticles.push({
        id: `particle-${i}-${Date.now()}`,
        moleculeIndex: i % 2,
        isProduct: false,
        x: 30 + Math.random() * (width - 60),
        y: 30 + Math.random() * (height - 60),
        vx: Math.cos(angle) * speedScale,
        vy: Math.sin(angle) * speedScale,
        radius: 12,
        type: i % 2 === 0 ? 'A2' : 'B2',
        color: i % 2 === 0 ? '#38BDF8' : '#EF4444',
        mass: 1,
        rotAngle: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.1,
      });
    }

    particlesRef.current = newParticles;
    setReactantCount(count);
    setProductCount(0);
    setSuccessfulCollisions(0);
  };

  // Reset chamber on mount or particle count change
  useEffect(() => {
    initParticles(settings.totalReactantParticles);
  }, [settings.totalReactantParticles]);

  // Main Physics Engine Loop
  useEffect(() => {
    let lastRateCheck = performance.now();
    let conversionsInWindow = 0;

    const updatePhysics = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      // Clear canvas with subtle grid background
      ctx.fillStyle = '#090D16';
      ctx.fillRect(0, 0, width, height);

      // Draw thermal background grid
      ctx.strokeStyle = '#1E293B';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      if (!settings.isRunning) {
        // Draw static particles if paused
        particlesRef.current.forEach((p) => drawParticle(ctx, p));
        animFrameIdRef.current = requestAnimationFrame(updatePhysics);
        return;
      }

      const now = performance.now();
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.05) * settings.timeSpeed;
      lastTimeRef.current = now;

      const particles = particlesRef.current;
      const speedMultiplier = Math.sqrt(settings.temperatureK / 300);

      // 1. Move Particles & Wall Bounce
      particles.forEach((p) => {
        p.x += p.vx * speedMultiplier * dt * 60;
        p.y += p.vy * speedMultiplier * dt * 60;
        p.rotAngle += p.rotSpeed;

        // Wall collision
        if (p.x - p.radius < 0) {
          p.x = p.radius;
          p.vx = -p.vx;
        }
        if (p.x + p.radius > width) {
          p.x = width - p.radius;
          p.vx = -p.vx;
        }
        if (p.y - p.radius < 0) {
          p.y = p.radius;
          p.vy = -p.vy;
        }
        if (p.y + p.radius > height) {
          p.y = height - p.radius;
          p.vy = -p.vy;
        }
      });

      // 2. Particle-Particle Collision & Reaction Check
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];

          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = p1.radius + p2.radius;

          if (dist < minDist) {
            // Elastic collision response
            const nx = dx / dist;
            const ny = dy / dist;
            const kx = p1.vx - p2.vx;
            const ky = p1.vy - p2.vy;
            const p = 2 * (nx * kx + ny * ky) / (p1.mass + p2.mass);

            p1.vx -= p * p2.mass * nx;
            p1.vy -= p * p2.mass * ny;
            p2.vx += p * p1.mass * nx;
            p2.vy += p * p1.mass * ny;

            // Separate overlapping particles
            const overlap = minDist - dist;
            p1.x -= nx * overlap * 0.5;
            p1.y -= ny * overlap * 0.5;
            p2.x += nx * overlap * 0.5;
            p2.y += ny * overlap * 0.5;

            // Collision Kinetic Energy: Ek = 0.5 * m * v_rel^2
            const relativeVelocitySq = (p1.vx - p2.vx) ** 2 + (p1.vy - p2.vy) ** 2;
            const collisionEnergy = 0.5 * relativeVelocitySq * 25 * (settings.temperatureK / 250);

            // Check if collision leads to chemical reaction!
            // Condition: Both must be reactants of complementary types (A2 + B2 -> 2 AB)
            if (!p1.isProduct && !p2.isProduct && p1.type !== p2.type) {
              if (collisionEnergy >= settings.activationEnergyThreshold) {
                // Chemical reaction occurs! Transform into product AB!
                p1.isProduct = true;
                p2.isProduct = true;
                p1.type = 'AB';
                p2.type = 'AB';
                p1.color = '#22C55E';
                p2.color = '#22C55E';

                // Energy released/absorbed (Exothermic vs Endothermic speed kick)
                const speedMod = settings.reactionEnthalpy < 0 ? 1.25 : 0.8;
                p1.vx *= speedMod;
                p1.vy *= speedMod;
                p2.vx *= speedMod;
                p2.vy *= speedMod;

                conversionsInWindow++;
                setSuccessfulCollisions((prev) => prev + 1);

                // Draw explosion flash effect
                ctx.fillStyle = '#F59E0B';
                ctx.beginPath();
                ctx.arc((p1.x + p2.x) / 2, (p1.y + p2.y) / 2, 25, 0, Math.PI * 2);
                ctx.fill();
              }
            }
          }
        }
      }

      // 3. Draw Particles
      let rCount = 0;
      let pCount = 0;
      particles.forEach((p) => {
        if (p.isProduct) pCount++;
        else rCount++;
        drawParticle(ctx, p);
      });

      setReactantCount(rCount);
      setProductCount(pCount);

      // Update reaction rate calculation window (moles/sec)
      if (now - lastRateCheck > 1000) {
        const rate = (conversionsInWindow / (now - lastRateCheck)) * 1000;
        setReactionRate(parseFloat(rate.toFixed(1)));
        conversionsInWindow = 0;
        lastRateCheck = now;
      }

      animFrameIdRef.current = requestAnimationFrame(updatePhysics);
    };

    animFrameIdRef.current = requestAnimationFrame(updatePhysics);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [settings]);

  // Helper to draw molecular particles in canvas
  const drawParticle = (ctx: CanvasRenderingContext2D, p: KineticParticle) => {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotAngle);

    if (p.isProduct) {
      // Product Molecule (AB dimer)
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(-6, 0, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.arc(6, 0, 8, 0, Math.PI * 2);
      ctx.fill();

      // Bond line
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-6, 0);
      ctx.lineTo(6, 0);
      ctx.stroke();
    } else {
      // Reactant Molecule (Diatomic A2 or B2)
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(-5, 0, 7, 0, Math.PI * 2);
      ctx.arc(5, 0, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-5, 0);
      ctx.lineTo(5, 0);
      ctx.stroke();
    }

    ctx.restore();
  };

  // Render Maxwell-Boltzmann Distribution & Activation Energy Graph on canvas
  useEffect(() => {
    const graphCanvas = graphCanvasRef.current;
    if (!graphCanvas) return;
    const ctx = graphCanvas.getContext('2d');
    if (!ctx) return;

    const width = graphCanvas.width;
    const height = graphCanvas.height;

    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(40, 10);
    ctx.lineTo(40, height - 30);
    ctx.lineTo(width - 10, height - 30);
    ctx.stroke();

    // Maxwell-Boltzmann Curve: f(v) = Math.sqrt(2/pi) * v^2 * exp(-v^2 / (2*a^2))
    const temp = settings.temperatureK;
    const ea = settings.activationEnergyThreshold;
    const a = Math.sqrt(temp / 300) * 35; // thermal parameter

    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    let eaX = 40;
    for (let x = 40; x < width - 10; x++) {
      const v = (x - 40) * 0.8;
      const f_v = (Math.sqrt(2 / Math.PI) * (v * v) * Math.exp(-(v * v) / (2 * a * a))) / (a * a);
      const y = height - 30 - f_v * 18000;

      if (x === 40) ctx.moveTo(x, Math.min(y, height - 30));
      else ctx.lineTo(x, Math.min(y, height - 30));

      // Map Ea to X axis
      if (Math.abs(v - ea * 0.6) < 1) {
        eaX = x;
      }
    }
    ctx.stroke();

    // Fill area under curve for particles with Energy >= Ea
    ctx.fillStyle = 'rgba(239, 68, 68, 0.35)';
    ctx.beginPath();
    ctx.moveTo(eaX, height - 30);
    for (let x = eaX; x < width - 10; x++) {
      const v = (x - 40) * 0.8;
      const f_v = (Math.sqrt(2 / Math.PI) * (v * v) * Math.exp(-(v * v) / (2 * a * a))) / (a * a);
      const y = height - 30 - f_v * 18000;
      ctx.lineTo(x, Math.min(y, height - 30));
    }
    ctx.lineTo(width - 10, height - 30);
    ctx.closePath();
    ctx.fill();

    // Activation Energy Ea vertical threshold line
    ctx.strokeStyle = '#EF4444';
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(eaX, 10);
    ctx.lineTo(eaX, height - 30);
    ctx.stroke();
    ctx.setLineDash([]);

    // Labels
    ctx.fillStyle = '#EF4444';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(`Ea = ${ea} kJ/mol`, Math.min(eaX - 25, width - 100), 22);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '10px sans-serif';
    ctx.fillText('Kinetic Energy (E = ½mv²)', width / 2 - 40, height - 10);
    ctx.fillText('Fraction of Molecules', 5, 20);
  }, [settings.temperatureK, settings.activationEnergyThreshold]);

  return (
    <div className="space-y-6">
      {/* Simulation Header */}
      <div className="bg-[#08090C] rounded-2xl p-5 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-semibold bg-indigo-950/80 text-indigo-400 border border-indigo-800/80">
              Advanced Physical Chemistry
            </span>
            <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-semibold bg-sky-950/80 text-sky-400 border border-sky-800/80">
              Collision Theory Simulator
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 tracking-wide">
            Kinetic Molecular Theory & Collision Physics
          </h2>
          <p className="text-xs text-slate-400">
            Observe real-time molecular collisions, Maxwell-Boltzmann velocity distributions, and activation energy thresholds ($E_a$).
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            id="toggle-sim-running"
            onClick={() => setSettings((s) => ({ ...s, isRunning: !s.isRunning }))}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold shadow-lg transition active:scale-95 ${
              settings.isRunning
                ? 'bg-amber-500 hover:bg-amber-400 text-black'
                : 'bg-emerald-500 hover:bg-emerald-400 text-black'
            }`}
          >
            {settings.isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{settings.isRunning ? 'Pause Sim' : 'Start Sim'}</span>
          </button>

          <button
            id="reset-chamber-btn"
            onClick={() => initParticles(settings.totalReactantParticles)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Chamber</span>
          </button>
        </div>
      </div>

      {/* Grid Layout: Chamber Canvas vs Maxwell-Boltzmann Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Particle Chamber (8 cols) */}
        <div className="lg:col-span-7 bg-[#08090C] rounded-2xl p-5 border border-slate-800 shadow-2xl flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-sky-400" />
              <h3 className="font-bold text-slate-200 text-sm">Reaction Chamber (A₂ + B₂ → 2 AB)</h3>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-sky-400 font-bold">Reactants (A₂, B₂): {reactantCount}</span>
              <span className="text-emerald-400 font-bold">Products (AB): {productCount}</span>
            </div>
          </div>

          {/* 2D Physics Canvas */}
          <div className="relative w-full rounded-xl overflow-hidden border border-slate-800 shadow-inner bg-[#050608]">
            <canvas
              ref={canvasRef}
              width={580}
              height={360}
              className="w-full h-auto block"
            />

            {/* Heat Source Visual Indicator */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-[#08090C]/90 backdrop-blur px-3.5 py-1 rounded-full border border-slate-800 text-xs font-mono">
              <Flame className={`w-4 h-4 ${settings.temperatureK > 500 ? 'text-amber-400 animate-pulse' : 'text-slate-500'}`} />
              <span className="text-slate-400">Chamber Temp:</span>
              <span className="font-bold text-amber-400">{settings.temperatureK} K</span>
            </div>
          </div>

          {/* Live Meter Stats Footer */}
          <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-800 text-center">
            <div className="bg-[#050608] p-2.5 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase font-mono font-medium">Reaction Rate</div>
              <div className="text-base font-mono font-bold text-sky-400">{reactionRate} <span className="text-[10px] text-slate-500">moles/s</span></div>
            </div>
            <div className="bg-[#050608] p-2.5 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase font-mono font-medium">Successful Reactions</div>
              <div className="text-base font-mono font-bold text-emerald-400">{successfulCollisions}</div>
            </div>
            <div className="bg-[#050608] p-2.5 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase font-mono font-medium">Yield Efficiency</div>
              <div className="text-base font-mono font-bold text-amber-400">
                {settings.totalReactantParticles > 0
                  ? Math.round((productCount / settings.totalReactantParticles) * 100)
                  : 0}%
              </div>
            </div>
          </div>
        </div>

        {/* Controls & Graph Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Maxwell-Boltzmann Velocity Distribution Canvas */}
          <div className="bg-[#08090C] rounded-2xl p-5 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-slate-200 text-sm">Maxwell-Boltzmann Distribution</h3>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Red Area = E ≥ Ea</span>
            </div>

            <canvas
              ref={graphCanvasRef}
              width={340}
              height={180}
              className="w-full h-auto rounded-xl border border-slate-800 block bg-[#050608]"
            />
          </div>

          {/* Slider Controls */}
          <div className="bg-[#08090C] rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <Sliders className="w-4 h-4 text-sky-400" />
              <h3 className="font-bold text-slate-200 text-sm">Thermodynamic Controls</h3>
            </div>

            {/* Temperature Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300 flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                  Temperature (T)
                </span>
                <span className="text-amber-400 font-mono">{settings.temperatureK} K</span>
              </div>
              <input
                id="temperature-slider"
                type="range"
                min={100}
                max={1000}
                step={10}
                value={settings.temperatureK}
                onChange={(e) => setSettings({ ...settings, temperatureK: Number(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>100 K (Cold)</span>
                <span>500 K</span>
                <span>1000 K (Extreme)</span>
              </div>
            </div>

            {/* Activation Energy Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-red-400" />
                  Activation Energy (Ea)
                </span>
                <span className="text-red-400 font-mono">{settings.activationEnergyThreshold} kJ/mol</span>
              </div>
              <input
                id="activation-energy-slider"
                type="range"
                min={20}
                max={160}
                step={5}
                value={settings.activationEnergyThreshold}
                onChange={(e) => setSettings({ ...settings, activationEnergyThreshold: Number(e.target.value) })}
                className="w-full accent-red-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>20 kJ (Fast)</span>
                <span>90 kJ</span>
                <span>160 kJ (High Barrier)</span>
              </div>
            </div>

            {/* Enthalpy Toggle (Exothermic vs Endothermic) */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-300 font-bold">Reaction Enthalpy (ΔH):</span>
              <div className="flex items-center bg-[#050608] p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  id="exothermic-btn"
                  onClick={() => setSettings({ ...settings, reactionEnthalpy: -120 })}
                  className={`px-2.5 py-1 rounded-lg font-bold font-mono transition ${
                    settings.reactionEnthalpy < 0
                      ? 'bg-red-950 text-red-400 border border-red-800'
                      : 'text-slate-500 hover:text-slate-200'
                  }`}
                >
                  Exothermic (-ΔH)
                </button>
                <button
                  id="endothermic-btn"
                  onClick={() => setSettings({ ...settings, reactionEnthalpy: 120 })}
                  className={`px-2.5 py-1 rounded-lg font-bold font-mono transition ${
                    settings.reactionEnthalpy > 0
                      ? 'bg-sky-950 text-sky-400 border border-sky-800'
                      : 'text-slate-500 hover:text-slate-200'
                  }`}
                >
                  Endothermic (+ΔH)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
