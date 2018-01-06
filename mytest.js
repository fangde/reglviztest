// First we import regl and call the constructor
var regl = require('regl')({extensions: ['oes_texture_float']})

/*
var axios=require('axios')


axios.get('http://jsonplaceholder.typicode.com/todos').then(function(response){
    console.log(response);
    console.log(response.data);
})
*/


console.log("hello")


random=Math.random;

// Particle count must be power of 2
var PARTICLE_COUNT_SQRT = 1024*8;
var PARTICLE_COUNT = PARTICLE_COUNT_SQRT*PARTICLE_COUNT_SQRT;




console.log('helo')



const  particleUVData = new Float32Array( PARTICLE_COUNT * 2 );
const interval = 1.0 / PARTICLE_COUNT_SQRT;

for ( var i = 0, u = 0, v = 1; i < PARTICLE_COUNT; i++, u = i * 2, v = u + 1 ) {
    particleUVData[ u ] = interval * ~~( i % PARTICLE_COUNT_SQRT ); // u
    particleUVData[ v ] = interval * ~~( i / PARTICLE_COUNT_SQRT ); // v
}








const particleData = new Float32Array( 4 * PARTICLE_COUNT);
for(var i=0;i<PARTICLE_COUNT;i++)
{
    particleData[4*i]=random()*10-5; //x
    particleData[4*i+1]=random()*10-5; //y
    particleData[4*i+2]=random()*100+1.0;//z
    particleData[4*i+3]=random()*16.0;//size
}







const tex=regl.texture({
    width:PARTICLE_COUNT_SQRT,
    height:PARTICLE_COUNT_SQRT,
    format:'rgba',
    type:'float32',
    data:particleData
})


const uvpos=regl.buffer(
    particleUVData
)


// The default method exposed by the module wraps a canvas element


// This clears the color buffer to black and the depth buffer to 1

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
    uniform float t;
    #define max_dis 11.0
    void main() {
    vec4 particle = texture2D( uParticleData, aParticleUV );
    gl_Position = vec4( particle.xyz, 1.0);
    gl_Position = gl_Position+vec4(0.1*t, 0.1*t,10.0*t,1.0);
    gl_PointSize = particle.w/particle.z;
    gl_Position.z = gl_Position.z/max_dis;
    if(gl_PointSize<0.01)
        gl_Position.z=10.0;
    }`,

    attributes: {
        aParticleUV: uvpos
    },

    uniforms: {
        uParticleData: tex,
        t:regl.prop('time')
    },


    count: PARTICLE_COUNT,
    primitive:'points'

}

const draw=regl(viz)

regl.frame(({tick})=>
{
regl.clear({
      color: [0, 0, 0, 1],
      depth: 1
  })

draw({time:Math.sin(0.01*tick)})
}
)

console.log(JSON.stringify(viz))
