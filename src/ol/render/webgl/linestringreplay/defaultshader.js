// This file is automatically generated, do not edit
goog.provide('ol.render.webgl.linestringreplay.defaultshader');

goog.require('ol');
goog.require('ol.webgl.Fragment');
goog.require('ol.webgl.Vertex');


/**
 * @constructor
 * @extends {ol.webgl.Fragment}
 * @struct
 */
ol.render.webgl.linestringreplay.defaultshader.Fragment = function() {
  ol.webgl.Fragment.call(this, ol.render.webgl.linestringreplay.defaultshader.Fragment.SOURCE);
};
ol.inherits(ol.render.webgl.linestringreplay.defaultshader.Fragment, ol.webgl.Fragment);


/**
 * @const
 * @type {string}
 */
ol.render.webgl.linestringreplay.defaultshader.Fragment.DEBUG_SOURCE = 'precision mediump float;\nvarying float v_round;\nvarying vec2 v_roundVertex;\nvarying float v_halfWidth;\n\n\n\nuniform float u_opacity;\nuniform vec4 u_color;\nuniform vec2 u_size;\nuniform float u_pixelRatio;\n\nvoid main(void) {\n  if (v_round > 0.0) {\n    vec2 windowCoords = vec2((v_roundVertex.x + 1.0) / 2.0 * u_size.x * u_pixelRatio,\n        (v_roundVertex.y + 1.0) / 2.0 * u_size.y * u_pixelRatio);\n    if (length(windowCoords - gl_FragCoord.xy) > v_halfWidth * u_pixelRatio) {\n      discard;\n    }\n  }\n  gl_FragColor = u_color;\n  float alpha = u_color.a * u_opacity;\n  if (alpha == 0.0) {\n    discard;\n  }\n  gl_FragColor.a = alpha;\n}\n';


/**
 * @const
 * @type {string}
 */
ol.render.webgl.linestringreplay.defaultshader.Fragment.OPTIMIZED_SOURCE = 'precision mediump float;varying float a;varying vec2 b;varying float c;uniform float m;uniform vec4 n;uniform vec2 o;uniform float p;void main(void){if(a>0.0){vec2 windowCoords=vec2((b.x+1.0)/2.0*o.x*p,(b.y+1.0)/2.0*o.y*p);if(length(windowCoords-gl_FragCoord.xy)>c*p){discard;}} gl_FragColor=n;float alpha=n.a*m;if(alpha==0.0){discard;}gl_FragColor.a=alpha;}';


/**
 * @const
 * @type {string}
 */
ol.render.webgl.linestringreplay.defaultshader.Fragment.SOURCE = ol.render.webgl.linestringreplay.defaultshader.Fragment.OPTIMIZED_SOURCE;


ol.render.webgl.linestringreplay.defaultshader.fragment = new ol.render.webgl.linestringreplay.defaultshader.Fragment();


/**
 * @constructor
 * @extends {ol.webgl.Vertex}
 * @struct
 */
ol.render.webgl.linestringreplay.defaultshader.Vertex = function() {
  ol.webgl.Vertex.call(this, ol.render.webgl.linestringreplay.defaultshader.Vertex.SOURCE);
};
ol.inherits(ol.render.webgl.linestringreplay.defaultshader.Vertex, ol.webgl.Vertex);


/**
 * @const
 * @type {string}
 */
ol.render.webgl.linestringreplay.defaultshader.Vertex.DEBUG_SOURCE = 'varying float v_round;\nvarying vec2 v_roundVertex;\nvarying float v_halfWidth;\n\n\nattribute vec2 a_lastPos;\nattribute vec2 a_position;\nattribute vec2 a_nextPos;\nattribute float a_direction;\n\nuniform mat4 u_projectionMatrix;\nuniform mat4 u_offsetScaleMatrix;\nuniform mat4 u_offsetRotateMatrix;\nuniform float u_lineWidth;\nuniform float u_miterLimit;\n\nbool nearlyEquals(in float value, in float ref) {\n  float epsilon = 0.000000000001;\n  return value >= ref - epsilon && value <= ref + epsilon;\n}\n\nvoid alongNormal(out vec2 offset, in vec2 nextP, in float turnDir, in float direction) {\n  vec2 dirVect = nextP - a_position;\n  vec2 normal = normalize(vec2(-turnDir * dirVect.y, turnDir * dirVect.x));\n  offset = u_lineWidth / 2.0 * normal * direction;\n}\n\nvoid miterUp(out vec2 offset, out float round, in bool isRound, in float direction) {\n  float halfWidth = u_lineWidth / 2.0;\n  vec2 tangent = normalize(normalize(a_nextPos - a_position) + normalize(a_position - a_lastPos));\n  vec2 normal = vec2(-tangent.y, tangent.x);\n  vec2 dirVect = a_nextPos - a_position;\n  vec2 tmpNormal = normalize(vec2(-dirVect.y, dirVect.x));\n  float miterLength = abs(halfWidth / dot(normal, tmpNormal));\n  offset = normal * direction * miterLength;\n  round = 0.0;\n  if (isRound) {\n    round = 1.0;\n  } else if (miterLength > u_miterLimit + u_lineWidth) {\n    offset = halfWidth * tmpNormal * direction;\n  }\n}\n\nbool miterDown(out vec2 offset, in vec4 projPos, in mat4 offsetMatrix, in float direction) {\n  bool degenerate = false;\n  vec2 tangent = normalize(normalize(a_nextPos - a_position) + normalize(a_position - a_lastPos));\n  vec2 normal = vec2(-tangent.y, tangent.x);\n  vec2 dirVect = a_lastPos - a_position;\n  vec2 tmpNormal = normalize(vec2(-dirVect.y, dirVect.x));\n  vec2 longOffset, shortOffset, longVertex;\n  vec4 shortProjVertex;\n  float halfWidth = u_lineWidth / 2.0;\n  if (length(a_nextPos - a_position) > length(a_lastPos - a_position)) {\n    longOffset = tmpNormal * direction * halfWidth;\n    shortOffset = normalize(vec2(dirVect.y, -dirVect.x)) * direction * halfWidth;\n    longVertex = a_nextPos;\n    shortProjVertex = u_projectionMatrix * vec4(a_lastPos, 0.0, 1.0);\n  } else {\n    shortOffset = tmpNormal * direction * halfWidth;\n    longOffset = normalize(vec2(dirVect.y, -dirVect.x)) * direction * halfWidth;\n    longVertex = a_lastPos;\n    shortProjVertex = u_projectionMatrix * vec4(a_nextPos, 0.0, 1.0);\n  }\n  //Intersection algorithm based on theory by Paul Bourke (http://paulbourke.net/geometry/pointlineplane/).\n  vec4 p1 = u_projectionMatrix * vec4(longVertex, 0.0, 1.0) + offsetMatrix * vec4(longOffset, 0.0, 0.0);\n  vec4 p2 = projPos + offsetMatrix * vec4(longOffset, 0.0, 0.0);\n  vec4 p3 = shortProjVertex + offsetMatrix * vec4(-shortOffset, 0.0, 0.0);\n  vec4 p4 = shortProjVertex + offsetMatrix * vec4(shortOffset, 0.0, 0.0);\n  float denom = (p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y);\n  float firstU = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / denom;\n  float secondU = ((p2.x - p1.x) * (p1.y - p3.y) - (p2.y - p1.y) * (p1.x - p3.x)) / denom;\n  float epsilon = 0.000000000001;\n  if (firstU > epsilon && firstU < 1.0 - epsilon && secondU > epsilon && secondU < 1.0 - epsilon) {\n    shortProjVertex.x = p1.x + firstU * (p2.x - p1.x);\n    shortProjVertex.y = p1.y + firstU * (p2.y - p1.y);\n    offset = shortProjVertex.xy;\n    degenerate = true;\n  } else {\n    float miterLength = abs(halfWidth / dot(normal, tmpNormal));\n    offset = normal * direction * miterLength;\n  }\n  return degenerate;\n}\n\nvoid squareCap(out vec2 offset, out float round, in bool isRound, in vec2 nextP,\n    in float turnDir, in float direction) {\n  round = 0.0;\n  vec2 dirVect = a_position - nextP;\n  vec2 firstNormal = normalize(dirVect);\n  vec2 secondNormal = vec2(turnDir * firstNormal.y * direction, -turnDir * firstNormal.x * direction);\n  vec2 hypotenuse = normalize(firstNormal - secondNormal);\n  vec2 normal = vec2(turnDir * hypotenuse.y * direction, -turnDir * hypotenuse.x * direction);\n  float length = sqrt(v_halfWidth * v_halfWidth * 2.0);\n  offset = normal * length;\n  if (isRound) {\n    round = 1.0;\n  }\n}\n\nvoid main(void) {\n  bool degenerate = false;\n  float direction = float(sign(a_direction));\n  mat4 offsetMatrix = u_offsetScaleMatrix * u_offsetRotateMatrix;\n  vec2 offset;\n  vec4 projPos = u_projectionMatrix * vec4(a_position, 0.0, 1.0);\n  bool round = nearlyEquals(mod(a_direction, 2.0), 0.0);\n\n  v_round = 0.0;\n  v_halfWidth = u_lineWidth / 2.0;\n  v_roundVertex = projPos.xy;\n\n  if (nearlyEquals(mod(a_direction, 3.0), 0.0) || nearlyEquals(mod(a_direction, 17.0), 0.0)) {\n    alongNormal(offset, a_nextPos, 1.0, direction);\n  } else if (nearlyEquals(mod(a_direction, 5.0), 0.0) || nearlyEquals(mod(a_direction, 13.0), 0.0)) {\n    alongNormal(offset, a_lastPos, -1.0, direction);\n  } else if (nearlyEquals(mod(a_direction, 23.0), 0.0)) {\n    miterUp(offset, v_round, round, direction);\n  } else if (nearlyEquals(mod(a_direction, 19.0), 0.0)) {\n    degenerate = miterDown(offset, projPos, offsetMatrix, direction);\n  } else if (nearlyEquals(mod(a_direction, 7.0), 0.0)) {\n    squareCap(offset, v_round, round, a_nextPos, 1.0, direction);\n  } else if (nearlyEquals(mod(a_direction, 11.0), 0.0)) {\n    squareCap(offset, v_round, round, a_lastPos, -1.0, direction);\n  }\n  if (!degenerate) {\n    vec4 offsets = offsetMatrix * vec4(offset, 0.0, 0.0);\n    gl_Position = projPos + offsets;\n  } else {\n    gl_Position = vec4(offset, 0.0, 1.0);\n  }\n}\n\n\n';


/**
 * @const
 * @type {string}
 */
ol.render.webgl.linestringreplay.defaultshader.Vertex.OPTIMIZED_SOURCE = 'varying float a;varying vec2 b;varying float c;attribute vec2 d;attribute vec2 e;attribute vec2 f;attribute float g;uniform mat4 h;uniform mat4 i;uniform mat4 j;uniform float k;uniform float l;bool nearlyEquals(in float value,in float ref){float epsilon=0.000000000001;return value>=ref-epsilon&&value<=ref+epsilon;}void alongNormal(out vec2 offset,in vec2 nextP,in float turnDir,in float direction){vec2 dirVect=nextP-e;vec2 normal=normalize(vec2(-turnDir*dirVect.y,turnDir*dirVect.x));offset=k/2.0*normal*direction;}void miterUp(out vec2 offset,out float round,in bool isRound,in float direction){float halfWidth=k/2.0;vec2 tangent=normalize(normalize(f-e)+normalize(e-d));vec2 normal=vec2(-tangent.y,tangent.x);vec2 dirVect=f-e;vec2 tmpNormal=normalize(vec2(-dirVect.y,dirVect.x));float miterLength=abs(halfWidth/dot(normal,tmpNormal));offset=normal*direction*miterLength;round=0.0;if(isRound){round=1.0;}else if(miterLength>l+k){offset=halfWidth*tmpNormal*direction;}} bool miterDown(out vec2 offset,in vec4 projPos,in mat4 offsetMatrix,in float direction){bool degenerate=false;vec2 tangent=normalize(normalize(f-e)+normalize(e-d));vec2 normal=vec2(-tangent.y,tangent.x);vec2 dirVect=d-e;vec2 tmpNormal=normalize(vec2(-dirVect.y,dirVect.x));vec2 longOffset,shortOffset,longVertex;vec4 shortProjVertex;float halfWidth=k/2.0;if(length(f-e)>length(d-e)){longOffset=tmpNormal*direction*halfWidth;shortOffset=normalize(vec2(dirVect.y,-dirVect.x))*direction*halfWidth;longVertex=f;shortProjVertex=h*vec4(d,0.0,1.0);}else{shortOffset=tmpNormal*direction*halfWidth;longOffset=normalize(vec2(dirVect.y,-dirVect.x))*direction*halfWidth;longVertex=d;shortProjVertex=h*vec4(f,0.0,1.0);}vec4 p1=h*vec4(longVertex,0.0,1.0)+offsetMatrix*vec4(longOffset,0.0,0.0);vec4 p2=projPos+offsetMatrix*vec4(longOffset,0.0,0.0);vec4 p3=shortProjVertex+offsetMatrix*vec4(-shortOffset,0.0,0.0);vec4 p4=shortProjVertex+offsetMatrix*vec4(shortOffset,0.0,0.0);float denom=(p4.y-p3.y)*(p2.x-p1.x)-(p4.x-p3.x)*(p2.y-p1.y);float firstU=((p4.x-p3.x)*(p1.y-p3.y)-(p4.y-p3.y)*(p1.x-p3.x))/denom;float secondU=((p2.x-p1.x)*(p1.y-p3.y)-(p2.y-p1.y)*(p1.x-p3.x))/denom;float epsilon=0.000000000001;if(firstU>epsilon&&firstU<1.0-epsilon&&secondU>epsilon&&secondU<1.0-epsilon){shortProjVertex.x=p1.x+firstU*(p2.x-p1.x);shortProjVertex.y=p1.y+firstU*(p2.y-p1.y);offset=shortProjVertex.xy;degenerate=true;}else{float miterLength=abs(halfWidth/dot(normal,tmpNormal));offset=normal*direction*miterLength;}return degenerate;}void squareCap(out vec2 offset,out float round,in bool isRound,in vec2 nextP,in float turnDir,in float direction){round=0.0;vec2 dirVect=e-nextP;vec2 firstNormal=normalize(dirVect);vec2 secondNormal=vec2(turnDir*firstNormal.y*direction,-turnDir*firstNormal.x*direction);vec2 hypotenuse=normalize(firstNormal-secondNormal);vec2 normal=vec2(turnDir*hypotenuse.y*direction,-turnDir*hypotenuse.x*direction);float length=sqrt(c*c*2.0);offset=normal*length;if(isRound){round=1.0;}} void main(void){bool degenerate=false;float direction=float(sign(g));mat4 offsetMatrix=i*j;vec2 offset;vec4 projPos=h*vec4(e,0.0,1.0);bool round=nearlyEquals(mod(g,2.0),0.0);a=0.0;c=k/2.0;b=projPos.xy;if(nearlyEquals(mod(g,3.0),0.0)||nearlyEquals(mod(g,17.0),0.0)){alongNormal(offset,f,1.0,direction);}else if(nearlyEquals(mod(g,5.0),0.0)||nearlyEquals(mod(g,13.0),0.0)){alongNormal(offset,d,-1.0,direction);}else if(nearlyEquals(mod(g,23.0),0.0)){miterUp(offset,a,round,direction);}else if(nearlyEquals(mod(g,19.0),0.0)){degenerate=miterDown(offset,projPos,offsetMatrix,direction);}else if(nearlyEquals(mod(g,7.0),0.0)){squareCap(offset,a,round,f,1.0,direction);}else if(nearlyEquals(mod(g,11.0),0.0)){squareCap(offset,a,round,d,-1.0,direction);}if(!degenerate){vec4 offsets=offsetMatrix*vec4(offset,0.0,0.0);gl_Position=projPos+offsets;}else{gl_Position=vec4(offset,0.0,1.0);}}';


/**
 * @const
 * @type {string}
 */
ol.render.webgl.linestringreplay.defaultshader.Vertex.SOURCE = ol.render.webgl.linestringreplay.defaultshader.Vertex.OPTIMIZED_SOURCE;


ol.render.webgl.linestringreplay.defaultshader.vertex = new ol.render.webgl.linestringreplay.defaultshader.Vertex();


/**
 * @constructor
 * @param {WebGLRenderingContext} gl GL.
 * @param {WebGLProgram} program Program.
 * @struct
 */
ol.render.webgl.linestringreplay.defaultshader.Locations = function(gl, program) {

  /**
   * @type {WebGLUniformLocation}
   */
  this.u_color = gl.getUniformLocation(program, 'n');

  /**
   * @type {WebGLUniformLocation}
   */
  this.u_lineWidth = gl.getUniformLocation(program, 'k');

  /**
   * @type {WebGLUniformLocation}
   */
  this.u_miterLimit = gl.getUniformLocation(program, 'l');

  /**
   * @type {WebGLUniformLocation}
   */
  this.u_offsetRotateMatrix = gl.getUniformLocation(program, 'j');

  /**
   * @type {WebGLUniformLocation}
   */
  this.u_offsetScaleMatrix = gl.getUniformLocation(program, 'i');

  /**
   * @type {WebGLUniformLocation}
   */
  this.u_opacity = gl.getUniformLocation(program, 'm');

  /**
   * @type {WebGLUniformLocation}
   */
  this.u_pixelRatio = gl.getUniformLocation(program, 'p');

  /**
   * @type {WebGLUniformLocation}
   */
  this.u_projectionMatrix = gl.getUniformLocation(program, 'h');

  /**
   * @type {WebGLUniformLocation}
   */
  this.u_size = gl.getUniformLocation(program, 'o');

  /**
   * @type {number}
   */
  this.a_direction = gl.getAttribLocation(program, 'g');

  /**
   * @type {number}
   */
  this.a_lastPos = gl.getAttribLocation(program, 'd');

  /**
   * @type {number}
   */
  this.a_nextPos = gl.getAttribLocation(program, 'f');

  /**
   * @type {number}
   */
  this.a_position = gl.getAttribLocation(program, 'e');
};
