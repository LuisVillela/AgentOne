document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.createElement("canvas");
    document.getElementById("orb-container").appendChild(canvas);

    const renderer = new OGL.Renderer({ canvas, width: window.innerWidth, height: window.innerHeight });
    const gl = renderer.gl;
    document.body.appendChild(gl.canvas);

    const scene = new OGL.Scene();
    const geometry = new OGL.Sphere(gl);

    const program = new OGL.Program(gl, {
        vertex: `
            attribute vec3 position;
            attribute vec2 uv;
            uniform mat4 modelViewMatrix;
            uniform mat4 projectionMatrix;
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragment: `
            precision highp float;
            varying vec2 vUv;
            uniform float time;
            void main() {
                vec3 color = vec3(0.0, 0.5 + 0.5 * sin(time), 1.0);
                gl_FragColor = vec4(color, 1.0);
            }
        `,
        uniforms: {
            time: { value: 0 },
        },
    });

    const mesh = new OGL.Mesh(gl, { geometry, program });
    scene.add(mesh);

    function animate(t) {
        requestAnimationFrame(animate);
        program.uniforms.time.value = t * 0.001;
        renderer.render({ scene });
    }
    
    animate(0);

    window.addEventListener("resize", () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});
