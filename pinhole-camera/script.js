import * as THREE from 'https://unpkg.com/three@0.157.0/build/three.module.js';
import { GUI } from 'https://cdn.jsdelivr.net/npm/lil-gui@0.18/+esm';

const scene = new THREE.Scene();
const aspectRatio = window.innerWidth / window.innerHeight;

// --- Orthographic camera (needed for 2D view) ---
const camera = new THREE.OrthographicCamera(-aspectRatio * 5, aspectRatio * 5, 5, -5, 0.1, 100);
camera.position.set(0, 0, 10);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// --- Black box ---
const boxDepth = 1;
const boxWidth = 0.1;
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
const boxGeometry = new THREE.BoxGeometry(boxWidth, 6, boxDepth);
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);

// --- Aperture ---
let aperture = 0.3;
const barWidth = 0.1;
const barHeight = 3;
const barMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

const topBar = new THREE.Mesh(new THREE.BoxGeometry(barWidth, barHeight, 0.2), barMaterial);
const bottomBar = new THREE.Mesh(new THREE.BoxGeometry(barWidth, barHeight, 0.2), barMaterial);

function updateApertureBars() {
  topBar.position.set(0, aperture / 2 + barHeight / 2, boxDepth / 2 + 0.01);
  bottomBar.position.set(0, -aperture / 2 - barHeight / 2, boxDepth / 2 + 0.01);
}
updateApertureBars();

scene.add(topBar);
scene.add(bottomBar);

// --- Screen plane ---
const screenMaterial = new THREE.MeshBasicMaterial({ color: 0xeeeeee, opacity: 0.7, transparent: true });
const screenGeometry = new THREE.PlaneGeometry(0.2, 6);
const screen = new THREE.Mesh(screenGeometry, screenMaterial);
screen.position.set(3, 0, 0);
scene.add(screen);

// --- Light source ---
const sourceGeometry = new THREE.SphereGeometry(0.15, 16, 16);
const sourceMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const source = new THREE.Mesh(sourceGeometry, sourceMaterial);
source.position.set(-3, 0, 0);
scene.add(source);

// --- Light rays ---
let rayLines = [];
function clearRays() {
  rayLines.forEach(obj => scene.remove(obj));
  rayLines = [];
}

function drawRays(n) {
  clearRays();
  const spacing = aperture / n; // spacing to center rays inside aperture
  for (let i = 0; i < n; i++) {
    const offsetY = -aperture / 2 + spacing / 2 + spacing * i;
    const origin = new THREE.Vector3(source.position.x, source.position.y, 0);

    const holeX = 0;
    const holeY = offsetY;
    const holePos = new THREE.Vector3(holeX, holeY, 0);

    const geo1 = new THREE.BufferGeometry().setFromPoints([origin, holePos]);
    const line1 = new THREE.Line(geo1, new THREE.LineBasicMaterial({ color: 0xff0000 }));
    scene.add(line1);
    rayLines.push(line1);

    const t = (screen.position.x - holeX) / (holeX - origin.x);
    const proj = new THREE.Vector3(screen.position.x, holeY - (origin.y - holeY) * t, 0);

    const geo2 = new THREE.BufferGeometry().setFromPoints([holePos, proj]);
    const line2 = new THREE.Line(geo2, new THREE.LineBasicMaterial({ color: 0x00cc00 }));
    scene.add(line2);
    rayLines.push(line2);

    const point = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0x9933ff })
    );
    point.position.copy(proj);
    scene.add(point);
    rayLines.push(point);
  }
}

// --- GUI ---
const params = {
  numberOfRays: 7,
  aperture: aperture
};

const gui = new GUI();
gui.add(params, 'numberOfRays', 1, 15, 1).name('Number of rays').onChange(() => {
  drawRays(params.numberOfRays);
});
gui.add(params, 'aperture', 0.05, 3, 0.01).name('Aperture').onChange(value => {
  aperture = value;
  updateApertureBars();
  drawRays(params.numberOfRays);
});

// --- Move source on click ---
renderer.domElement.addEventListener('click', (event) => {
  const mouse = new THREE.Vector2(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);
  const planeZ0 = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const intersect = new THREE.Vector3();
  raycaster.ray.intersectPlane(planeZ0, intersect);
  if (intersect.x < -boxWidth) {
    source.position.copy(intersect);
    drawRays(params.numberOfRays);
  }
});

// --- Window resize ---
window.addEventListener('resize', () => {
  const newAspectRatio = window.innerWidth / window.innerHeight;
  camera.left = -newAspectRatio * 5;
  camera.right = newAspectRatio * 5;
  camera.top = 5;
  camera.bottom = -5;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- Animation loop ---
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// --- Initial draw ---
drawRays(params.numberOfRays);
