// 1. Créer la scène, la caméra, et le rendu
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);  // Ajuste la taille du rendu
document.body.appendChild(renderer.domElement);  // Ajoute le rendu à la page

// 2. Créer un carré (plan) avec une couleur
const geometry = new THREE.PlaneGeometry(5, 5);  // Crée un carré de 5x5 unités
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });  // Vert
const square = new THREE.Mesh(geometry, material);  // Crée un objet 3D avec cette géométrie et matériau
scene.add(square);  // Ajoute le carré à la scène

// 3. Positionner la caméra
camera.position.z = 10;  // Place la caméra un peu loin du carré pour bien le voir

// 4. Fonction d'animation
function animate() {
  requestAnimationFrame(animate);  // Demande à l'ordinateur de redessiner la scène à chaque frame

  // On fait tourner le carré pour qu'il soit animé
  square.rotation.x += 0.01;
  square.rotation.y += 0.01;

  renderer.render(scene, camera);  // Rendu de la scène avec la caméra
}

animate();  // Lance l'animation
