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
 * Glassy purple sphere — full square canvas; R≈0.34 so the disk sits smaller with transparent margin.
 * Stronger motion: breathing radius, orbiting key light (no specular blob).
 * Interior: layered sine “nebula” field on the sphere normal (gas wisps, slow drift).
 * Interior emission ~#c2008e + soft outer halo around the rim.
 */
const FS = `#version 300 es
precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
in vec2 v_uv;
out vec4 fragColor;

/** Brand emission #c2008e (sRGB → linear-ish in-shader coefficients). */
const vec3 EMISSION = vec3(0.7608, 0.0, 0.5569);

/** Fractal-ish nebula density on the unit sphere; cheap, no texture lookup. */
float nebulaField(vec3 p, float t) {
  float nt = t * 1.28;
  vec3 q = p * 3.8 + vec3(nt * 0.11, nt * 0.07, nt * 0.09);
  float w = 0.0;
  w += sin(q.x * 1.7 + q.y * 2.3 + sin(q.z * 1.1));
  w += sin(q.y * 2.1 - q.z * 1.9 + nt * 0.55) * 0.72;
  w += sin(q.z * 1.6 + q.x * 2.4 + nt * 0.48) * 0.65;
  w += sin(length(q.xy) * 4.2 - nt * 0.62) * 0.45;
  w += sin(length(q.yz) * 3.5 + nt * 0.38) * 0.38;
  float s = 0.5 + 0.5 * sin(w);
  float f = pow(clamp(s, 0.0, 1.0), 1.35);
  float wisp = smoothstep(0.25, 0.92, f) * (0.55 + 0.45 * sin(nt * 0.31 + p.x * 5.0));
  return clamp(f * 0.55 + wisp * 0.45, 0.0, 1.0);
}

/** Screen blend — lightens dark colors clearly (soft/hard light stay near-black on dark nebula). */
vec3 screenBlend(vec3 base, vec3 blend) {
  return 1.0 - (1.0 - clamp(base, vec3(0.0), vec3(1.0))) * (1.0 - clamp(blend, vec3(0.0), vec3(1.0)));
}

void main() {
  vec2 uv = v_uv;
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  float t = u_time;

  vec2 c = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);
  float r = length(c);

  float R = 0.34 + sin(t * 0.72) * 0.012 + sin(t * 1.15) * 0.006;
  R = clamp(R, 0.28, 0.38);

  vec3 rgb = vec3(0.0);
  if (r < R - 1e-4) {
    float h = sqrt(R * R - dot(c, c));
    vec3 N = normalize(vec3(c, h));
    vec3 V = vec3(0.0, 0.0, 1.0);
    float NdotV = clamp(dot(N, V), 0.0, 1.0);
    float fresnel = pow(1.0 - NdotV, 2.35);

    float ang = t * 0.58;
    vec3 L = normalize(vec3(
      -0.40 + 0.16 * sin(ang),
      0.38 + 0.14 * cos(ang * 0.88),
      0.78 + 0.06 * sin(ang * 1.3)
    ));

    float depth = h / R;
    vec3 coreDark = vec3(0.07, 0.02, 0.13);
    vec3 coreMid = vec3(0.2, 0.06, 0.36);
    vec3 body = mix(coreDark, coreMid, depth * 0.9 + fresnel * 0.12);
    float diff = max(dot(N, L), 0.0);
    body += vec3(0.12, 0.04, 0.2) * diff * (0.35 + 0.12 * sin(t * 0.9));

    vec3 rim = vec3(0.58, 0.32, 1.0) * fresnel * (1.25 + 0.22 * sin(t * 1.6));
    rgb = body + rim;

    /* Nebula: emissive gas tinted with EMISSION — stronger when looking through the glass (low fresnel). */
    vec3 Nn = normalize(N + vec3(sin(t * 0.21), cos(t * 0.17), sin(t * 0.27)) * 0.08);
    float dens = nebulaField(Nn, t);
    float dens2 = nebulaField(Nn.yzx * 1.07 + 0.33, t * 1.12 + 1.7);
    float mixAmt = 0.5 + 0.5 * sin(t * 0.31 + Nn.x * 4.0);
    vec3 gasA = mix(EMISSION * 0.42, EMISSION * 1.18, dens);
    vec3 gasB = mix(EMISSION * 0.58, EMISSION * 1.28, dens2);
    vec3 nebulaRgb = mix(gasA, gasB, mixAmt);
    float inward = pow(1.0 - fresnel, 1.5);
    float depthGlow = mix(0.55, 1.0, depth);
    float nebWeight = dens * inward * depthGlow * 0.52 + dens2 * inward * 0.18;
    rgb += nebulaRgb * nebWeight;
    rgb += EMISSION * pow(dens, 3.0) * inward * 0.16;

    /* Interior highlight: screen blend; tight angular × disk product = small localized patch. */
    vec3 blobDir = normalize(vec3(
      0.4 + 0.1 * sin(t * 0.22),
      -0.16 + 0.07 * cos(t * 0.2),
      0.82 + 0.05 * sin(t * 0.16)
    ));
    float nd = max(dot(N, blobDir), 0.0);
    float angBlob = smoothstep(0.52, 0.98, nd) * pow(max(nd, 0.02), 1.9);
    vec2 cBlob = c - vec2(0.05 * aspect + 0.02 * sin(t * 0.19), -0.048 + 0.016 * cos(t * 0.21));
    float rc = length(cBlob) / max(R, 1e-4);
    float diskBlob = 1.0 - smoothstep(0.42, 0.68, rc);
    float blobMask = clamp(angBlob * diskBlob * smoothstep(0.0, 0.9, depth), 0.0, 1.0);
    float lift = blobMask * 0.3;
    rgb = clamp(screenBlend(rgb, vec3(lift)), vec3(0.0), vec3(1.0));

    /* Inner glow — EMISSION-led bloom + inner shell (slightly boosted). */
    vec3 innerGlowCol = mix(EMISSION, vec3(1.0, 0.94, 0.98), 0.22);
    float innerCenter = pow(NdotV, 2.35);
    float innerShell = pow(1.0 - fresnel, 2.85);
    rgb += innerGlowCol * (0.21 * innerCenter + 0.17 * innerShell);
  }

  /* Outer glow: straight RGB × alpha must not double-apply exp falloff (SRC_ALPHA composites rgb*a). */
  vec3 outerStraight = vec3(1.0, 0.94, 0.98) * 0.55;
  float outerSigma = R * 0.34 + 0.056;
  float outerAmt = 0.0;
  if (r > R) {
    outerAmt = exp(-(r - R) / outerSigma);
  }
  float outerA = outerAmt * 0.68;
  if (r > R) {
    rgb = outerStraight;
  }

  float w = max(fwidth(r) * 2.5, 0.003);
  /* edge0 < edge1 — valid smoothstep; 1 inside disk, 0 outside */
  float diskAlpha = 1.0 - smoothstep(R - w, R + w, r);
  float alpha = max(diskAlpha, outerA);

  rgb = pow(rgb, vec3(0.96));
  fragColor = vec4(rgb, alpha);
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
 * WebGL2 hero: glassy purple sphere on a transparent canvas (page background shows through).
 */
export function AgentWebGLHero({
  className,
  /** Override layout (default: square tile sized to the sphere’s bounding box). */
  heightClass,
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
      alpha: true,
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
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

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
      g.clearColor(0.0, 0.0, 0.0, 0.0);
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
        "relative mb-8 w-full overflow-hidden sm:mb-10",
        heightClass ?? "mx-auto aspect-square max-w-[min(100%,360px)]",
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
