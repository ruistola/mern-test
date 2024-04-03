const renderer = (glctx: WebGL2RenderingContext, todos: Float32Array) => {

  const vertexShaderSource =
    `#version 300 es
    precision highp float;
    precision highp int;
    layout(std140, column_major) uniform;
    layout(location = 0 ) in vec2 pos;
    void main( void ) { gl_Position = vec4( pos, 0.0, 1.0 ); }`;

  const fragmentShaderSource =
    `#version 300 es
    precision highp float;
    precision highp int;
    layout(std140, column_major) uniform;

    uniform vec4 res;
    uniform vec3 itemPositions[32];
    uniform int numItems;

    // uniform _uData
    // {
    //     vec4 res;
    //     vec4 bpos;
    //     vec4 camX;
    //     vec4 camY;
    //     vec4 camZ;
    //     vec4 camPos;
    //     vec4 sliders;
    //     vec4 objPos;
    // } uData;

    out vec4 color;

    float sphere(in vec3 point, in vec4 sphere)
    {
        return length( point - sphere.xyz ) - sphere.w;
    }

    float f(in vec3 p) {
      float d = 10000.0;
      for (int i=0; i<numItems; ++i) {
        d = min(d, sphere(p, vec4(itemPositions[i], 0.5)));
      }
      return d;
    }

    void main()
    {
      float viewPortRatio = res.x / res.y;
      vec3 clipSpacePixel = vec3(viewPortRatio * (-1.0 + gl_FragCoord.x / res.x * 2.0) , -1.0 + gl_FragCoord.y / res.y * 2.0, 0.0);
      const float focalDistance = 2.0;
      vec3 camPos = vec3(0.0, 0.0, 10.0);
      vec3 camX = vec3(1.0,0.0,0.0);
      vec3 camY = vec3(0.0,1.0,0.0);
      vec3 camZ = vec3(0.0,0.0,1.0);
      vec3 rd = normalize(vec3(camPos - camZ * focalDistance + camX * clipSpacePixel.x + camY * clipSpacePixel.y ) - camPos);
      vec3 ro = camPos;

      float epsilon = 0.0001;
      float t = 0.0;
      color = vec4(0.0,0.0,1.0,1.0);
      float steps = 0.0;
      for (int i=0;i<512;++i)
      {
          if ( t > 1000.0 ) break;
          float d = f(ro+rd*t);
          if (d<epsilon) break;
          t += d;
          steps += 1.0;
      }
      color = vec4( vec3( 1.0 - ( steps + 1.0 ) / 33.0 ), 1.0 );
    }`;

  const createShader = (vsrc: string, fsrc: string) : WebGLProgram | null => {
    const p = glctx.createProgram();
    const vs = glctx.createShader(glctx.VERTEX_SHADER);
    const fs = glctx.createShader(glctx.FRAGMENT_SHADER);
    if (!p || !vs || !fs) return null;

    glctx.shaderSource(vs, vsrc);
    glctx.compileShader(vs);

    if (!glctx.getShaderParameter(vs, glctx.COMPILE_STATUS)) {
      console.log("Shader compile errors:");
      console.log(glctx.getShaderInfoLog(vs));
    }

    glctx.shaderSource(fs, fsrc);
    glctx.compileShader(fs);

    if (!glctx.getShaderParameter(fs, glctx.COMPILE_STATUS)) {
      console.log("Shader compile errors:");
      console.log(glctx.getShaderInfoLog(fs));
    }

    glctx.attachShader(p, vs);
    glctx.attachShader(p, fs);
    glctx.linkProgram(p);
    if (!glctx.getProgramParameter(p, glctx.LINK_STATUS)) {
      console.log("Shader linker errors:");
      console.log(glctx.getProgramInfoLog(p));
    }

    glctx.useProgram(p);

    glctx.detachShader(p, vs);
    glctx.detachShader(p, fs);
    glctx.deleteShader(vs);
    glctx.deleteShader(fs);
    glctx.useProgram(null);

    return p;
  };
  
  const shader = createShader(vertexShaderSource, fragmentShaderSource);
  if (!shader) return;

  const vbo = glctx.createBuffer();
  glctx.bindBuffer( glctx.ARRAY_BUFFER, vbo );
  glctx.bufferData( glctx.ARRAY_BUFFER, new Float32Array( [ -1.0, 3.0, 3.0, -1.0, -1.0, -1.0 ] ), glctx.STATIC_DRAW );

  const ibo = glctx.createBuffer();
  glctx.bindBuffer( glctx.ELEMENT_ARRAY_BUFFER, ibo );
  glctx.bufferData( glctx.ELEMENT_ARRAY_BUFFER, new Uint16Array( [ 0, 1, 2 ] ), glctx.STATIC_DRAW );

  const width = glctx.drawingBufferWidth;
  const height = glctx.drawingBufferHeight;

  glctx.clearColor( 0.0, 0.0, 0.0, 1.0 );

  const resLocation = glctx.getUniformLocation(shader, "res");
  const numItemsLocation = glctx.getUniformLocation(shader, "numItems");
  const itemPositionsLocation = glctx.getUniformLocation(shader, "itemPositions");

  const render = () => {
    glctx.useProgram( shader );

    glctx.clear( glctx.COLOR_BUFFER_BIT | glctx.DEPTH_BUFFER_BIT | glctx.STENCIL_BUFFER_BIT );

    glctx.enableVertexAttribArray(0);
    glctx.vertexAttribPointer(0, 2, glctx.FLOAT, false, 0, 0);
    glctx.viewport(0, 0, width, height);
    glctx.uniform4f(resLocation, width, height, 0.0, 0.0);

    glctx.uniform1i(numItemsLocation, todos.length/3);
    glctx.uniform3fv(itemPositionsLocation, todos);
    glctx.drawElements( glctx.TRIANGLES, 3, glctx.UNSIGNED_SHORT, 0 );

    glctx.useProgram( null );

    requestAnimationFrame(render);
  };

  requestAnimationFrame(render);
};

export default renderer;
