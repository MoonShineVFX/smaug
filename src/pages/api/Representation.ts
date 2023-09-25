import fs from 'fs';
import crypto from 'crypto';
import multer from 'multer';
import { createRouter, expressWrapper } from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next'
import { RepresentationType, Prisma } from '@prisma/client';
import prisma from '../../client';
import { settings } from '../../libs/common';

const router = createRouter<NextApiRequest, NextApiResponse>();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `${settings.STORAGE_ROOT}/${req.body.asserId}/`);
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    },
  });

const upload = multer({ storage: storage });

interface MulterApiRequest extends NextApiRequest {
  file: Express.Multer.File;
}

const uploadFile = expressWrapper(upload.single('file')) as any;
router.use(uploadFile);
router.post(uploadFile, async (req, res)=> {
    await handlePost(req as MulterApiRequest, res)
})

router.all((req, res)=>{
    res.status(405).json({ message: "Method not allowed" })
})

export default router.handler({
  onError: (err, req, res) => {
      res.status(500).json({ message: (err as Error).message })
  }
});

async function handlePost(req:MulterApiRequest, res:NextApiResponse){
    const { name, description, type } = req.body;
    const { mimetype } = req.file;
    let filename = req.file.filename;

    const representation: Prisma.RepresentationCreateInput = {
        name,
        description,
        type: type as RepresentationType,
        path,
        mimetype,
    }
    const result = await prisma.representation.create({ data: representation });
    res.status(200).json(result);
}

