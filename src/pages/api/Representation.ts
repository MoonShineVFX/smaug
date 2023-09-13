import multer from 'multer';
import { createRouter, expressWrapper } from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next'
import { RepresentationType, Prisma } from '@prisma/client';
import prisma from '../../client';


const router = createRouter<NextApiRequest, NextApiResponse>();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    },
  });

const upload = multer({ storage: storage });

const uploadFile = expressWrapper(upload.single('file')) as any;
router.post(uploadFile, async (req, res)=> {
    await handlePost(req, res)
})


router.all((req, res)=>{
    res.status(405).json({ message: "Method not allowed" })
})

async function handlePost(req:NextApiRequest, res:NextApiResponse):Promise<void>{
    
}

export default router.handler({
    onError: (err, req, res) => {
        res.status(500).json({ message: (err as Error).message })
    }
});