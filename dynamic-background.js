// Dynamic WebGL Background Component
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.163.0/build/three.module.js';

// 桌面端着色器（高质量）
const fragmentShaderCodeDesktop = `
  precision highp float;
  uniform vec2 u_resolution;
  uniform float u_time;
  varying vec2 vUv;

  #define EPSILON 1e-6
  #define PI 3.14159265359
  #define ITERATIONS 18.0

  mat2 rotate2d(float angle){
    return mat2(cos(angle), -sin(angle),
                sin(angle), cos(angle));
  }

  void main() {
    vec2 uv = (vUv * 2.0 - 1.0) * (u_resolution / max(u_resolution.x, u_resolution.y));
    vec2 u = uv * 0.25;
    vec4 o = vec4(0.5, 1.0, 1.5, 0.0);
    vec4 z = o;
    vec2 v_internal = vec2(0.0);
    float a = 0.6;
    float t = u_time * 0.8;

    for (float i = 0.0; i < ITERATIONS; i++)
    {
      float u_dot = dot(u, u);
      float denom_u = 0.6 - u_dot;
      denom_u += sign(denom_u) * EPSILON;

      vec2 sin_arg = (1.4 * u / denom_u) - (7.0 * u.yx * cos(t*0.2)) + t * 1.1 + v_internal * 0.3;
      vec2 length_arg = (1.0 + i * 0.1 + a * 0.2) * sin(sin_arg);
      float len = length(length_arg);
      float safe_len_divisor = max(len, EPSILON);

      o += (1.0 + sin(z * 0.9 + t * 1.2 + i * 0.1)) / safe_len_divisor * (1.0 + i*0.02);

      v_internal = 0.9 * v_internal + 0.15 * sin(t * 1.5 + u * 4.0 - o.xy * 0.2);
      v_internal = clamp(v_internal, -1.0, 1.0);

      a += 0.035;
      float angle = i * 0.1 + t * 0.05 + a * 0.2;
      mat2 rot_mat = rotate2d(angle);
      u *= rot_mat;

      float o_dot = dot(o.xyz, o.xyz);
      float feedback_scale = 0.5 + 0.5 * sin(o_dot * 0.02 + t * 0.3);

      u += sin(60.0 * dot(u,u) * cos(80.0 * u.yx + t * 1.2)) / 2.5e2
          + 0.15 * a * u * feedback_scale
          + cos(o.xy * 0.5 + t * 1.1 + v_internal * 0.8) / 3.5e2;

      u += rotate2d(v_internal.x * 0.01) * vec2(0.0001, 0.0);
    }

    vec3 base_color = 0.5 + 0.5 * cos(o.xyz * 0.8 + t * 0.15 + vec3(0.0, PI * 0.66, PI * 1.33));
    vec2 detail_coord = u * 5.0 + v_internal * 1.0;
    float detail_pattern = smoothstep(0.3, 0.7, fract(detail_coord.x * cos(t*0.1) + detail_coord.y * sin(t*0.1)));
    vec3 detail_color = vec3(detail_pattern * 0.8 + 0.2);
    float mix_factor = clamp(length(o.xyz) * 0.1 - 0.1, 0.0, 1.0);
    vec3 final_color = mix(base_color, detail_color * base_color, mix_factor);
    final_color.rg += u.xy * 0.05;
    float dist_from_center = length(vUv - 0.5);
    final_color *= pow(1.0 - dist_from_center * 1.2, 2.0);
    gl_FragColor = vec4(clamp(final_color, 0.0, 1.0), 1.0);
  }
`;

// 移动端着色器（简化版本，更好的性能）
const fragmentShaderCodeMobile = `
  precision mediump float;
  uniform vec2 u_resolution;
  uniform float u_time;
  varying vec2 vUv;

  #define PI 3.14159265359
  #define ITERATIONS 8.0

  mat2 rotate2d(float angle){
    return mat2(cos(angle), -sin(angle),
                sin(angle), cos(angle));
  }

  void main() {
    vec2 uv = (vUv * 2.0 - 1.0) * (u_resolution / max(u_resolution.x, u_resolution.y));
    vec2 u = uv * 0.3;
    vec4 o = vec4(0.5, 1.0, 1.5, 0.0);
    float t = u_time * 0.6;

    for (float i = 0.0; i < ITERATIONS; i++)
    {
      float u_dot = dot(u, u);
      float denom_u = 0.7 - u_dot;
      if (abs(denom_u) < 0.001) denom_u = 0.001;

      vec2 sin_arg = (1.2 * u / denom_u) + t * 0.8;
      vec2 length_arg = (1.0 + i * 0.15) * sin(sin_arg);
      float len = length(length_arg);
      if (len < 0.001) len = 0.001;

      o += (1.0 + sin(o.xyz * 0.6 + t * 0.8)) / len * (1.0 + i*0.03);

      float angle = i * 0.15 + t * 0.08;
      mat2 rot_mat = rotate2d(angle);
      u *= rot_mat;
      u += sin(30.0 * u_dot) / 100.0;
    }

    vec3 color = 0.5 + 0.5 * cos(o.xyz * 0.6 + t * 0.2 + vec3(0.0, PI * 0.66, PI * 1.33));
    float dist_from_center = length(vUv - 0.5);
    color *= pow(1.0 - dist_from_center * 1.0, 1.5);
    gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
  }
`;

const vertexShaderCode = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4( position, 1.0 );
  }
`;

class DynamicBackground {
  constructor(containerId = 'dynamic-bg-container') {
    this.containerId = containerId;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.mesh = null;
    this.material = null;
    this.clock = null;
    this.container = null;
    this.isInitialized = false;

    this.uniforms = {
      u_time: { value: 0.0 },
      u_resolution: { value: new THREE.Vector2() }
    };
  }

  init() {
    this.container = document.getElementById(this.containerId);
    if (!this.container) {
      console.error(`Container with id '${this.containerId}' not found`);
      return;
    }

    // 检测移动设备并降低复杂度
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    console.log('Initializing dynamic background, mobile:', isMobile);

    this.clock = new THREE.Clock();

    // 移动端优化设置
    const rendererOptions = { 
      alpha: true,
      antialias: !isMobile, // 移动端关闭抗锯齿
      powerPreference: isMobile ? "low-power" : "high-performance"
    };

    this.renderer = new THREE.WebGLRenderer(rendererOptions);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    
    // 移动端降低像素比以提升性能
    const pixelRatio = isMobile ? Math.min(window.devicePixelRatio, 1.5) : Math.min(window.devicePixelRatio, 2);
    this.renderer.setPixelRatio(pixelRatio);
    
    this.container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const geometry = new THREE.PlaneGeometry(2, 2);

    // 根据设备类型选择着色器
    const fragmentShader = isMobile ? fragmentShaderCodeMobile : fragmentShaderCodeDesktop;
    
    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vertexShaderCode,
      fragmentShader: fragmentShader
    });

    this.mesh = new THREE.Mesh(geometry, this.material);
    this.scene.add(this.mesh);

    this.uniforms.u_resolution.value.x = window.innerWidth;
    this.uniforms.u_resolution.value.y = window.innerHeight;

    window.addEventListener('resize', () => this.onWindowResize());

    this.isInitialized = true;
    this.animate();
    
    console.log("Dynamic background initialized successfully");
  }

  onWindowResize() {
    if (!this.isInitialized) return;
    
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.uniforms.u_resolution.value.x = window.innerWidth;
    this.uniforms.u_resolution.value.y = window.innerHeight;
  }

  animate() {
    if (!this.isInitialized) return;
    
    requestAnimationFrame(() => this.animate());
    this.uniforms.u_time.value = this.clock.getElapsedTime();
    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    if (this.renderer) {
      this.renderer.dispose();
      if (this.container && this.renderer.domElement) {
        this.container.removeChild(this.renderer.domElement);
      }
    }
    if (this.material) {
      this.material.dispose();
    }
    this.isInitialized = false;
  }
}

// Export for ES6 modules
export { DynamicBackground };

// Also export for global use
window.DynamicBackground = DynamicBackground; 