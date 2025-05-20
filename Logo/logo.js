// 1. Scène de base
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 3;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2. Charger la texture (logo.png)
const textureLoader = new THREE.TextureLoader();
textureLoader.load('logo.png', function(texture) {
  // 3. Créer un plan avec cette texture
  const geometry = new THREE.PlaneGeometry(2, 2); // taille du plan
  const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
  const logoMesh = new THREE.Mesh(geometry, material);
  scene.add(logoMesh);

  // 4. Animation
  function animate() {
    requestAnimationFrame(animate);
    logoMesh.rotation.y += 0.01;
    renderer.render(scene, camera);
  }
  animate();
}, undefined, function(error) {
  console.error('Erreur de chargement du logo :', error);
});
