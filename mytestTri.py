# -----------------------------------------------------------------------------
# Copyright (c) 2009-2016 Nicolas P. Rougier. All rights reserved.
# Distributed under the (new) BSD License.
# -----------------------------------------------------------------------------
import numpy as np
from glumpy import app, gl, gloo
import json

f=open('dv.json')
s=f.read()

print s

viz=json.loads(s)




window = app.Window(width=800, height=800, color=(1,1,1,1))


program = gloo.Program(str(viz['vert']), str(viz['frag']), viz['count'])


attr=viz['attributes']
print attr

for a in attr:
	print a
	print attr[a]
	program[a] = attr[a]
uni=viz['uniforms']
print uni

for u in uni:
	print u
	print uni[u]
	program[u]=uni[u]






	
@window.event
def on_draw(dt):
    global theta, phi, translate
    window.clear()
    program.draw(gl.GL_TRIANGLES)
    


gl.glEnable(gl.GL_DEPTH_TEST)
app.run()
