// Без import — THREE уже глобальный объект благодаря <script> тегу

// --- Сцена, камера, рендерер ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050510);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 8);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// --- Освещение ---
scene.add(new THREE.AmbientLight(0x404060));

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

const pointLight1 = new THREE.PointLight(0xff00ff, 1, 20);
pointLight1.position.set(2, 3, 4);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0x00ffff, 1, 20);
pointLight2.position.set(-3, -1, 5);
scene.add(pointLight2);

// --- Кристалл ---
const geometry = new THREE.OctahedronGeometry(1.8, 0);

const material = new THREE.MeshStandardMaterial({
    color: 0x4a00e0,
    emissive: 0x220066,
    roughness: 0.2,
    metalness: 0.8,
    transparent: true,
    opacity: 0.95
});

const crystal = new THREE.Mesh(geometry, material);
scene.add(crystal);

// Каркас поверх
const wireframeMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    wireframe: true,
    transparent: true,
    opacity: 0.3
});
const wireframeCrystal = new THREE.Mesh(geometry, wireframeMaterial);
wireframeCrystal.scale.set(1.01, 1.01, 1.01);
crystal.add(wireframeCrystal);

// --- Звёзды ---
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 2000;
const posArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i += 3) {
    const radius = 6 + Math.random() * 15;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);

    posArray[i]     = Math.sin(phi) * Math.cos(theta) * radius;
    posArray[i + 1] = Math.sin(phi) * Math.sin(theta) * radius;
    posArray[i + 2] = Math.cos(phi) * radius;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.1,
    color: 0xffffff,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// --- Цветные частицы ---
const coloredGeo = new THREE.BufferGeometry();
const coloredCount = 300;
const cPos = new Float32Array(coloredCount * 3);
const cCol = new Float32Array(coloredCount * 3);

for (let i = 0; i < coloredCount * 3; i += 3) {
    const radius = 3 + Math.random() * 4;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);

    cPos[i]     = Math.sin(phi) * Math.cos(theta) * radius;
    cPos[i + 1] = Math.sin(phi) * Math.sin(theta) * radius;
    cPos[i + 2] = Math.cos(phi) * radius;

    const r = Math.random();
    if (r < 0.33) { cCol[i] = 0; cCol[i+1] = 1; cCol[i+2] = 1; }
    else if (r < 0.66) { cCol[i] = 1; cCol[i+1] = 0.2; cCol[i+2] = 1; }
    else { cCol[i] = 0.6; cCol[i+1] = 0; cCol[i+2] = 1; }
}

coloredGeo.setAttribute('position', new THREE.BufferAttribute(cPos, 3));
coloredGeo.setAttribute('color', new THREE.BufferAttribute(cCol, 3));

const coloredMat = new THREE.PointsMaterial({
    size: 0.15,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
});

const coloredParticles = new THREE.Points(coloredGeo, coloredMat);
scene.add(coloredParticles);

// --- Анимация ---
function animate() {
    const t = performance.now() * 0.001;

    crystal.rotation.x += 0.003;
    crystal.rotation.y += 0.007;
    crystal.rotation.z += 0.002;

    const s = 1 + Math.sin(t * 2) * 0.03;
    crystal.scale.set(s, s, s);

    particles.rotation.y += 0.0002;
    coloredParticles.rotation.y -= 0.0005;

    pointLight1.position.x = Math.sin(t * 0.5) * 5;
    pointLight1.position.z = Math.cos(t * 0.7) * 5;
    pointLight2.position.x = Math.sin(t * 0.8 + 2) * 4;
    pointLight2.position.z = Math.cos(t * 0.6 + 1) * 5;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
animate();

// --- Ресайз ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});