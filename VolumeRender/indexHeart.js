const regl=require('regl')({ extensions: ['webgl_draw_buffers', 'oes_texture_float']})
const mat4=require('gl-mat4')

const rsl=require('resl')


var camera=require('regl-camera')(regl,{
  center:[0,0,0],
  distance:1.5,
  theta: Math.PI/2



})




const cubePos= [
    // Front face
    0.0, 0.0, 1.0,
    1.0, 0.0, 1.0,
    1.0, 1.0, 1.0,
    0.0, 1.0, 1.0,

    // Back face
    0.0, 0.0, 0.0,
    0.0, 1.0, 0.0,
    1.0, 1.0, 0.0,
    1.0, 0.0, 0.0,

    // Top face
    0.0,  1.0, 0.0,
    0.0,  1.0, 1.0,
    1.0,  1.0, 1.0,
    1.0,  1.0, 0.0,

    // Bottom face
    0.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 1.0,
    0.0, 0.0, 1.0,

    // Right face
    1.0, 0.0, 0.0,
    1.0, 1.0, 0.0,
    1.0, 1.0, 1.0,
    1.0, 0.0, 1.0,

    // Left face
    0.0, 0.0, 0.0,
    0.0, 0.0, 1.0,
    0.0, 1.0, 1.0,
    0.0, 1.0, 0.0,
];


const cubeColor=[
    // Front face
    0.0, 0.0, 1.0, 1.0,
    1.0, 0.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    0.0, 1.0, 1.0, 1.0,

    // Back face
    0.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    1.0, 1.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,

    // Top face
    0.0, 1.0, 0.0, 1.0,
    0.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 0.0, 1.0,

    // Bottom face
    0.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 1.0, 1.0,
    0.0, 0.0, 1.0, 1.0,

    // Right face
    1.0, 0.0, 0.0, 1.0,
    1.0, 1.0, 0.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 0.0, 1.0, 1.0,

    // Left face
    0.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
    0.0, 1.0, 1.0, 1.0,
    0.0, 1.0, 0.0, 1.0
];


const cubeEle=[
    0, 1, 2,      0, 2, 3,    // Front face
    4, 5, 6,      4, 6, 7,    // Back face
    8, 9, 10,     8, 10, 11,  // Top face
    12, 13, 14,   12, 14, 15, // Bottom face
    16, 17, 18,   16, 18, 19, // Right face
    20, 21, 22,   20, 22, 23  //

];



var model=mat4.create()




mat4.rotateY(model,model,Math.PI)
mat4.rotateX(model,model,Math.PI/2)
mat4.translate(model,model,[-0.5,-0.5,-0.5,0])


console.log(model)


const fb=regl.framebuffer({
        color:[regl.texture({type:'float',width:1024,height:1024})]

    }

)

const DrawCube=regl({

        vert: `
    #ifdef GL_ES
    precision highp float;
    #endif

    attribute vec3 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 view,projection, model;


    varying vec4 backColor;

    void main(void)
    {
        vec4 pos = projection * view* model*vec4(aVertexPosition, 1.0);
        //vec4 pos = uMVMatrix * vec4(aVertexPosition, 1.0);
        //vec4 pos=vec4(aVertexPosition, 1.0);
        gl_Position = pos;
        backColor = aVertexColor;
    }`,


        frag: `
    #ifdef GL_ES
    precision highp float;
    #endif

    varying vec4 backColor;

    void main(void)
    {
        gl_FragColor = backColor;
    }`,

    attributes:
        {
            aVertexPosition:regl.prop('pos'),


            aVertexColor: regl.prop('color')
        },


        elements:regl.prop('ele'),

        uniforms: {

          model: regl.prop('mobj')

      },

      depth:{
        enable:true,
        func:'>='



      },


      framebuffer: fb
    }



    )

const DrawVolum=regl(
  {
    vert:`
    #ifdef GL_ES
    precision highp float;
    #endif

    attribute vec3 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 projection,view,model;

    varying vec4 frontColor;
    varying vec4 pos;

    void main(void)
    {
         pos = projection * view * model* vec4(aVertexPosition, 1.0);
        //vec4 pos = uMVMatrix * vec4(aVertexPosition, 1.0);
        //vec4 pos=vec4(aVertexPosition, 1.0);
        gl_Position = pos;
        frontColor = aVertexColor;
    }`
    ,
    frag: `
      #ifdef GL_ES
      precision highp float;
      #endif

      varying vec4 frontColor;
      varying vec4 pos;

      uniform float threshold;

      uniform vec3 cpos;



      uniform sampler2D uBackCoord;
      uniform sampler2D uVolData;
      uniform sampler2D uTransferFunction;




      const float steps = 500.0;
      uniform float numberOfSlices;// = 96.0;
      uniform float slicesOverX;// = 10.0;
      uniform float slicesOverY;// = 10.0;


      float getVolumeValue(vec3 volpos)
      {
      	float s1,s2;
      	float dx1,dy1;
      	float dx2,dy2;

      	vec2 texpos1,texpos2;

      	s1 = floor(volpos.z*numberOfSlices);
      	s2 = s1+1.0;

      	dx1 = fract(s1/slicesOverX);
      	dy1 = floor(s1/slicesOverX)/slicesOverY;

      	dx2 = fract(s2/slicesOverX);
      	dy2 = floor(s2/slicesOverX)/slicesOverY;

      	texpos1.x = dx1+(volpos.x/slicesOverX);
      	texpos1.y = dy1+(volpos.y/slicesOverY);

      	texpos2.x = dx2+(volpos.x/slicesOverX);
      	texpos2.y = dy2+(volpos.y/slicesOverY);

      	return mix( texture2D(uVolData,texpos1).x, texture2D(uVolData,texpos2).x, (volpos.z*numberOfSlices)-s1);
      }

      void main(void)
      {
      	vec2 texC = pos.xy/pos.w;
      	texC.x = 0.5*texC.x + 0.5;
      	texC.y = 0.5*texC.y + 0.5;

      	vec4 backColor = texture2D(uBackCoord,texC);

      	vec3 dir = backColor.rgb - frontColor.rgb;
      	vec4 vpos = frontColor;

        	float cont = 0.0;

      	vec3 Step = dir/steps;

      	vec4 accum = vec4(0, 0, 0, 0);
      	vec4 sample = vec4(0.0, 0.0, 0.0, 0.0);
       	vec4 value = vec4(0, 0, 0, 0);

      	float opacityFactor = 8.0;
      	float lightFactor = 1.3;
      	float d;

      	for(float i = 0.0; i < steps; i+=1.0)
      	{
      		vec2 tf_pos;

      		tf_pos.x = getVolumeValue(vpos.xyz);
      		tf_pos.y = 0.5;

      		value = texture2D(uTransferFunction,tf_pos);

      		// Process thethume sample


      		if(value.a<threshold)
      			sample.a=0.0;
      		else
      			sample.a=value.a * opacityFactor * (1.0/steps);


      		sample.rgb = value.rgb * sample.a * lightFactor;



      		accum.rgb += (1.0 - accum.a) * sample.rgb;
      		accum.a += sample.a;

      		//advance the current position
      		vpos.xyz += Step;

      		//break if the position is greater than <1, 1, 1>
      		if(vpos.x > 1.0 || vpos.y > 1.0 || vpos.z > 1.0 || accum.a>=1.0)
      		    break;


      	}

      	gl_FragColor = accum;
        //gl_FragColor = backColor;
      }`
      ,
    attributes:
    {
      aVertexPosition:cubePos,
      aVertexColor: cubeColor
    },
    elements:cubeEle,

    uniforms: {



      uBackCoord:regl.prop('texture'),

      uTransferFunction: regl.prop('tf'),
      threshold:  0.5,
      uVolData: regl.prop('vol'),
      numberOfSlices: 96.0,
      slicesOverX:10.0,
      slicesOverY: 10.0,
      model: regl.prop('mobj')


  },

  depth:{
    enable:true,
    func:'<'


  },




  }
)

console.log("hello")




require('resl')({
  manifest: {
    texture: {
      type: 'image',
      src: './aorta-low.jpg',
      parser: (data) => regl.texture({
        data: data,
        mag: 'linear',
        min: 'linear'
      })
    },

    tf:{
      type:'image',
      src:'./tf.png',
      parser:(data)=>regl.texture({data:data,
        mag:'linear',
        min:'linear'})
    }
  },
  onDone: (asset) => {


    regl.frame(({tick,viewportWidth,viewportHeight})=>{

    camera(()=>{

      regl.clear({
        depth: -1,
        color: [1, 1, 1, 1],
        framebuffer:fb
      })

      DrawCube(
        {
            pos:cubePos,

            color:cubeColor,
            ele:cubeEle,
            mobj:model

        }
      )



      regl.clear({
        depth: 1,
        color: [1, 1, 1, 1]
      })

      DrawVolum({
                mobj: model,
                tf:asset.tf,
                vol:asset.texture,

                texture:fb.color[0]

                },

                )



    })



            }
          )
  }

})







//regl.frame(()=>{


// })
