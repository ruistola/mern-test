const renderer = (glctx: WebGL2RenderingContext) => {

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
    //uniform vec4 itemPositions[1024];
    uniform int numItems;

    uniform _uData
    {
        vec4 res;
        vec4 bpos;
        vec4 camX;
        vec4 camY;
        vec4 camZ;
        vec4 camPos;
        vec4 sliders;
        vec4 objPos;
    } uData;

    out vec4 color;

    void main()
    {
      vec2 uv = vec2(gl_FragCoord.x / res.x, gl_FragCoord.y / res.y);
      color = vec4(uv.x,uv.y,0.0,1.0);
    }`;

  const createShader = (vsrc: string, fsrc: string) : WebGLProgram | null => {
    const p = glctx.createProgram();
    const vs = glctx.createShader( glctx.VERTEX_SHADER );
    const fs = glctx.createShader( glctx.FRAGMENT_SHADER );
    if (!p || !vs || !fs) return null;

    glctx.shaderSource( vs, vsrc );
    glctx.compileShader( vs );
    if ( !glctx.getShaderParameter( vs, glctx.COMPILE_STATUS ) ) throw "Shader compile errors:\n" + glctx.getShaderInfoLog( vs ) + "\nSource:\n" + vsrc;

    glctx.shaderSource( fs, fsrc );
    glctx.compileShader( fs );
    if ( !glctx.getShaderParameter( fs, glctx.COMPILE_STATUS ) ) throw "Shader compile errors:\n" + glctx.getShaderInfoLog( fs ) + "\nSource:\n" + fsrc;

    glctx.attachShader( p, vs );
    glctx.attachShader( p , fs );
    glctx.linkProgram( p );
    if ( !glctx.getProgramParameter( p, glctx.LINK_STATUS )  ) throw "Shader link errors:\n" + glctx.getProgramInfoLog( p );
    glctx.useProgram( p );

    glctx.detachShader( p, vs );
    glctx.detachShader( p, fs );
    glctx.deleteShader(vs);
    glctx.deleteShader(fs);
    glctx.useProgram( null );

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

  // TODO: Use the UBO to pass in todo item positions
  const ubo = glctx.createBuffer();
  const uData = new Float32Array( 32 );

  const width = glctx.drawingBufferWidth;
  const height = glctx.drawingBufferHeight;

  glctx.clearColor( 0.0, 0.0, 0.0, 1.0 );

  const resLocation = glctx.getUniformLocation(shader, "res");

  const render = () => {
    glctx.useProgram( shader );

    glctx.clear( glctx.COLOR_BUFFER_BIT | glctx.DEPTH_BUFFER_BIT | glctx.STENCIL_BUFFER_BIT );

    glctx.enableVertexAttribArray(0);
    glctx.vertexAttribPointer(0, 2, glctx.FLOAT, false, 0, 0);
    glctx.viewport(0, 0, width, height);
    glctx.uniform4f(resLocation, width, height, 0.0, 0.0);

    glctx.bindBuffer( glctx.UNIFORM_BUFFER, ubo );
    glctx.bufferData( glctx.UNIFORM_BUFFER, uData , glctx.DYNAMIC_DRAW );
    glctx.bindBuffer( glctx.UNIFORM_BUFFER, null );
    glctx.bindBufferBase( glctx.UNIFORM_BUFFER, 0, ubo );

    glctx.drawElements( glctx.TRIANGLES, 3, glctx.UNSIGNED_SHORT, 0 );

    glctx.useProgram( null );

    requestAnimationFrame(render);
  };

  requestAnimationFrame(render);
};

export default renderer;
