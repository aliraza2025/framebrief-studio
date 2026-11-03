import {python} from './python.mjs';
export async function runExtension(path,payload){if(path!=='/api/render')throw new Error('Unknown integration.');return python('scripts/render_frame.py',payload);}
