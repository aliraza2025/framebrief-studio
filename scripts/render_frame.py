"""Render one original storyboard frame locally with a public diffusion model."""
import os,sys,json,time,base64
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
os.environ.setdefault('HF_HOME',str(ROOT/'.model-cache'))
import torch
from diffusers import DiffusionPipeline
torch.set_num_threads(2)
payload=json.load(sys.stdin)
prompt=payload.get('prompt','')
if not isinstance(prompt,str) or not prompt.strip() or len(prompt)>2000:raise ValueError('Use a visual prompt of 1–2000 characters.')
started=time.perf_counter();model=os.environ.get('DIFFUSION_MODEL','segmind/tiny-sd')
pipeline=DiffusionPipeline.from_pretrained(model,torch_dtype=torch.float32)
pipeline=pipeline.to('cpu');pipeline.set_progress_bar_config(disable=True)
result=pipeline(prompt=prompt,num_inference_steps=12,guidance_scale=7.0,width=384,height=256,generator=torch.Generator('cpu').manual_seed(7))
if result.nsfw_content_detected and any(result.nsfw_content_detected):raise ValueError('The model flagged the generated frame. Choose another prompt.')
output=ROOT/'.runtime';output.mkdir(exist_ok=True);path=output/'frame.png';result.images[0].save(path)
print(json.dumps({'model':model,'seed':7,'steps':12,'width':384,'height':256,'elapsedSeconds':round(time.perf_counter()-started,3),'prompt':prompt,'image':'data:image/png;base64,'+base64.b64encode(path.read_bytes()).decode(),'limits':'One locally generated planning frame. Visual continuity, production suitability, and output quality need human review.'}))
