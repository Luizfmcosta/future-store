"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

const VS = `#version 300 es
in vec2 a_position;
out vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

/**
 * Glassy purple sphere on navy + faint blue grid (reference-style, single pass).
 * Hemisphere fake-3D: Fresnel rim, interior depth, top-left specular, outer bloom.
 */
const FS = `#version 300 es
precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
in vec2 v_uv;
out vec4 fragColor;

void main() {
  vec2 uv = v_uv;
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 c = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);
  float r = length(c);
  float t = u_time;

  float R = 0.33 + sin(t * 0.5) * 0.01;

  vec3 navyA = vec3(0.012, 0.022, 0.055);
  vec3 navyB = vec3(0.04, 0.065, 0.12);
  float vignette = smoothstep(0.72, 0.2, r);
  vec3 bg = mix(navyA, navyB, vignette * 0.55 + 0.22);

  vec2 guv = c * 16.0;
  vec2 f = abs(fract(guv - 0.5) - 0.5) / fwidth(guv);
  float gridLine = 1.0 - min(min(f.x, f.y), 1.0);
  float grid = pow(gridLine, 0.35) * 0.14;
  vec3 gridRgb = vec3(0.32, 0.52, 0.95);
  bg += gridRgb * grid;

  vec3 bloomCol = vec3(0.48, 0.2, 0.88);
  float outsideGlow = exp(-max(r - R, 0.0) * 5.8) * 0.52;
  vec3 outside = bg + bloomCol * outsideGlow;

  vec3 inside = outside;
  if (r < R - 1e-4) {
    float h = sqrt(R * R - dot(c, c));
    vec3 N = normalize(vec3(c, h));
    vec3 V = vec3(0.0, 0.0, 1.0);
    float NdotV = clamp(dot(N, V), 0.0, 1.0);
    float fresnel = pow(1.0 - NdotV, 2.35);

    vec3 L = normalize(vec3(-0.46, 0.42, 0.78));
    vec3 Hv = normalize(L + V);
    float spec = pow(max(dot(N, Hv), 0.0), 140.0);
    vec3 specCol = vec3(1.0, 0.96, 0.88) * spec * 2.4;

    float depth = h / R;
    vec3 coreDark = vec3(0.07, 0.02, 0.13);
    vec3 coreMid = vec3(0.2, 0.06, 0.36);
    vec3 body = mix(coreDark, coreMid, depth * 0.9 + fresnel * 0.12);
    float diff = max(dot(N, L), 0.0);
    body += vec3(0.12, 0.04, 0.2) * diff * 0.35;

    vec3 rim = vec3(0.58, 0.32, 1.0) * fresnel * 1.25;
    inside = body + rim + specCol;
  }

  float edge = smoothstep(R + 0.006, R - 0.006, r);
  vec3 col = mix(outside, inside, edge);

  col = pow(col, vec3(0.96));
  fragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader | null {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[AgentWebGLHero] shader compile:", gl.getShaderInfoLog(sh));
    }
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

function createProgram(gl: WebGL2RenderingContext): WebGLProgram | null {
  const vs = compile(gl, gl.VERTEX_SHADER, VS);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FS);
  if (!vs || !fs) return null;
  const prog = gl.createProgram();
  if (!prog) return null;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[AgentWebGLHero] program link:", gl.getProgramInfoLog(prog));
    }
    gl.deleteProgram(prog);
    return null;
  }
  return prog;
}

/**
 * WebGL2 hero: glassy purple sphere, navy grid background (inspired by reference art).
 */
export function AgentWebGLHero({
  className,
  heightClass = "h-[400px]",
}: {
  className?: string;
  heightClass?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const glRef = useRef<WebGL2RenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const locRef = useRef<{ time: WebGLUniformLocation | null; res: WebGLUniformLocation | null }>({
    time: null,
    res: null,
  });
  const startRef = useRef(0);
  const reduceMotionRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    reduceMotionRef.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const gl = canvas.getContext("webgl2", {
      alpha: false,
      antialias: true,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      powerPreference: "default",
    });
    if (!gl) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[AgentWebGLHero] WebGL2 not available");
      }
      return;
    }
    glRef.current = gl;

    const program = createProgram(gl);
    if (!program) return;
    programRef.current = program;

    const posLoc = gl.getAttribLocation(program, "a_position");
    if (posLoc < 0) return;

    locRef.current.time = gl.getUniformLocation(program, "u_time");
    locRef.current.res = gl.getUniformLocation(program, "u_resolution");

    const vao = gl.createVertexArray();
    if (!vao) return;
    gl.bindVertexArray(vao);

    const buf = gl.createBuffer();
    if (!buf) return;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);

    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.STENCIL_TEST);
    gl.disable(gl.BLEND);

    const setSize = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cw = Math.max(1, Math.floor(w * dpr));
      const ch = Math.max(1, Math.floor(h * dpr));
      canvas.width = cw;
      canvas.height = ch;
      gl.viewport(0, 0, cw, ch);
    };

    setSize();
    startRef.current = performance.now();

    const ro = new ResizeObserver(() => {
      requestAnimationFrame(setSize);
    });
    ro.observe(wrap);

    const frame = (now: number) => {
      rafRef.current = requestAnimationFrame(frame);
      const g = glRef.current;
      const p = programRef.current;
      if (!g || !p) return;
      if (canvas.width < 2 || canvas.height < 2) {
        setSize();
        return;
      }

      const t = reduceMotionRef.current ? 0 : (now - startRef.current) * 0.001;
      g.bindVertexArray(vao);
      g.useProgram(p);
      g.uniform1f(locRef.current.time, t);
      g.uniform2f(locRef.current.res, canvas.width, canvas.height);
      g.clearColor(0.012, 0.022, 0.055, 1);
      g.clear(g.COLOR_BUFFER_BIT);
      g.drawArrays(g.TRIANGLES, 0, 6);
      g.bindVertexArray(null);
    };
    rafRef.current = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      gl.bindVertexArray(null);
      gl.deleteBuffer(buf);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
      programRef.current = null;
      glRef.current = null;
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className={cn(
        "relative mb-8 w-full min-h-[200px] overflow-hidden rounded-2xl border border-indigo-400/15 bg-[#050a18] sm:mb-10",
        heightClass,
        className,
      )}
    >
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        className="absolute inset-0 block h-full w-full"
        aria-hidden
      />
    </div>
  );
}
