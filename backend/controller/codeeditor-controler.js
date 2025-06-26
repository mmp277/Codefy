import {Worker} from 'worker_threads'
export async function CodeEditorFunc(req,res){
    const code=req.body.code;
    const language = req.params.lang
    const input = req.body.input
    try{
        const worker = new Worker('./coder.js');
        worker.postMessage({ code, language , input });
        
        worker.on('message', (message) => {
            if (message.error) {
            console.log('Error')
                return res.status(400).json({ "error":true , "message":message.error , "output":null });
            }
            return res.status(200).json({"error":false , "message":"Successfull Compilation" ,"output": message.output });
        });
        
        worker.on('error', (error) => {
            return res.status(500).json({ "error":true , "message":error.message , "output":null });
        });
        
        worker.on('exit', (code) => {
            if (code !== 0) {
                return res.status(500).json({
                    "error":true,
                    "message":"Some error occurred here",
                    "output":null
                })
            }
        });
        
        
    }catch(error){
        return res.status(500).json({
            "error":true,
            "message":"Some error occurred",
            "output":null
        })
    }
}