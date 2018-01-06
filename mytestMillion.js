// First we import regl and call the constructor
var regl = require('regl')({extensions: ['oes_texture_float']})
var axios=require('axios')


axios.get('http://jsonplaceholder.typicode.com/todos').then(function(response){
    console.log(response);
    console.log(response.data);
})



console.log("hello")


random=Math.random;

var PARTICLE_COUNT = 2048*2048;

// Particle count must be power of 2
var PARTICLE_COUNT_SQRT = 2048;


console.log('helo')



var particleUVData = new Float32Array( PARTICLE_COUNT * 2 );
var interval = 1.0 / PARTICLE_COUNT_SQRT;

for ( var i = 0, u = 0, v = 1; i < PARTICLE_COUNT; i++, u = i * 2, v = u + 1 ) {
    particleUVData[ u ] = interval * ~~( i % PARTICLE_COUNT_SQRT ); // u
    particleUVData[ v ] = interval * ~~( i / PARTICLE_COUNT_SQRT ); // v
}







particleData = new Float32Array( 4 * PARTICLE_COUNT);
for(var i=0;i<PARTICLE_COUNT;i++)
{
    particleData[4*i]=random()*10-5; //x
    particleData[4*i+1]=random()*10-5; //y
    particleData[4*i+2]=random()*100+1.0;//z
    particleData[4*i+3]=random()*64.0;//size
}





var viewportQuadVertices = new Float32Array([
    -1.0, -1.0, // 2----3
    1.0, -1.0, // | \  |
    -1.0,  1.0, // |  \ |
    1.0,  1.0  // 0----1
]);


var tex=regl.texture({
    width:2*1024,
    height:2*1024,
    format:'rgba',
    type:'float32',
    data:particleData
})


var uvpos=regl.buffer(
    particleUVData
)


// The default method exposed by the module wraps a canvas element


// This clears the color buffer to black and the depth buffer to 1
regl.clear({
    color: [0, 0, 0, 1],
    depth: 1
})

// In regl, draw operations are specified declaratively using. Each JSON
// command is a complete description of all state. This removes the need to
// .bind() things like buffers or shaders. All the boilerplate of setting up
// and tearing down state is automated.


viz={

    // In a draw call, we can pass the shader source code to regl
    frag: `
    precision highp 	float;
    void main() {
   
      float d=length(gl_PointCoord-0.5);
      if(d<0.5)
              gl_FragColor = vec4(gl_PointCoord.x,gl_PointCoord.y,1.0,1.0);
      else
          discard;
    }`,

    vert: `
    attribute vec2 aParticleUV;
    uniform sampler2D uParticleData;
    #define max_dis 11.0
    void main() {
    vec4 particle = texture2D( uParticleData, aParticleUV );
    gl_Position = vec4( particle.xyz, 1.0);
    gl_PointSize = particle.w/particle.z;
    gl_Position.z = gl_Position.z/max_dis;
    if(gl_PointSize<0.01)
        gl_Position.z=10.0;
    }`,

    attributes: {
        aParticleUV:uvpos
    },

    uniforms: {
        uParticleData: tex
    },


    count: PARTICLE_COUNT,
    primitive:'points'

}

regl(viz)()


console.log(JSON.stringify(viz))

















