// Create a new empty 3D scene
const scene = new THREE.Scene();
// Create a perspective camera with 75° field of view, aspect ratio based on window size,
// near clipping plane at 0.1 units, and far clipping plane at 1000 units
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
// Position the camera 3 units away from the scene along the Z axis so it can see the objects
camera.position.z = 3;

// Create a WebGL renderer with antialiasing enabled to smooth edges
const renderer = new THREE.WebGLRenderer({ antialias: true });
// Set the size of the rendering window to the full browser window size
renderer.setSize(window.innerWidth, window.innerHeight);
// Add the renderer's canvas element to the HTML document body so it becomes visible on the page
document.body.appendChild(renderer.domElement);

// Create a texture loader to load image files
const textureLoader = new THREE.TextureLoader();
// Declare a variable to hold the mesh object globally so it can be accessed later
let logoMesh;

// Load the logo.png texture asynchronously
textureLoader.load(
  'logo.png',                // URL of the image to load
  function(texture) {        // On successful load, this callback receives the loaded texture
    // Create a flat rectangular geometry (plane) 2 units wide and 2 units tall
    const geometry = new THREE.PlaneGeometry(2, 2);
    // Create a basic material using the loaded texture and enable transparency if the image has it
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    // Combine the geometry and material into a mesh (3D object)
    logoMesh = new THREE.Mesh(geometry, material);
    // Add the mesh to the scene so it will be rendered
    scene.add(logoMesh);
    // Start the animation loop now that the texture and mesh are ready
    animate();
  },
  undefined,                 // Optional: progress callback, not used here
  function(error) {          // On error during loading, this callback runs
    // Log an error message to the browser console
    console.error('Error loading logo:', error);
  }
);

// Define the animation loop function
function animate() {
  // Request the browser to call this function again before the next repaint
  requestAnimationFrame(animate);
  // If the mesh has been created, rotate it a bit around the Y axis every frame
  if (logoMesh) {
    logoMesh.rotation.x += 0.01;
  }
  // Render the current state of the scene from the perspective of the camera
  renderer.render(scene, camera);
}

// Add an event listener for when the window is resized
window.addEventListener('resize', () => {
  // Update the camera's aspect ratio to match the new window size
  camera.aspect = window.innerWidth / window.innerHeight;
  // Notify the camera to update its projection matrix due to aspect ratio change
  camera.updateProjectionMatrix();
  // Update the renderer size to fill the new window dimensions
  renderer.setSize(window.innerWidth, window.innerHeight);
});
