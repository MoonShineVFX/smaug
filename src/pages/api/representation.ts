// import fs from 'fs';
import fs from 'fs';
import { createId } from '@paralleldrive/cuid2'
import multer from 'multer';
import { createRouter, expressWrapper } from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next'
import { RepresentationType, RepresentationFormat, Prisma, RepresentationUsage } from '@prisma/client';
import prisma from '../../client';
import { settings } from '../../libs/common';

export const config = {
  api: {
    bodyParser: false
  }
}


interface MulterApiRequest extends NextApiRequest {
  file: Express.Multer.File;
  preserved: {
    assetId: string;
    uploaderId: string;
    representationUsage: RepresentationUsage;
    representationType: RepresentationType;
    representationFormat: RepresentationFormat;
  }
}

const router = createRouter<NextApiRequest, NextApiResponse>();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(req.body);
    const reqWithPreserved = req as unknown as MulterApiRequest;
    reqWithPreserved['preserved'] = { ...req.body };
    const folderPath = `${settings.STORAGE_ROOT}/${req.body.assetId}/`
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
      console.log(`資料夾 ${folderPath} 已經創建。`);
    } else {
      console.log(`資料夾 ${folderPath} 已經存在。`);
    }
    cb(null, `${settings.STORAGE_ROOT}/${req.body.assetId}/`);
  },
  filename: function (req, file, cb) {
    console.log('into filename function')
    const reqId = createId();
    console.log(`${reqId}${file.originalname}`)
    cb(null, `${reqId}${file.originalname}`);
  },
});

const upload = multer({ storage: storage });


const uploadFile = expressWrapper(upload.single('file')) as any;
router.use(uploadFile);
router.post(uploadFile, async (req, res) => {
  console.log(`in router of representation-create`)
  await handlePost(req as MulterApiRequest, res)
})

router.all((req, res) => {
  res.status(405).json({ message: "Method not allowed" })
})

export default router.handler({
  onError: (err, req, res) => {
    console.log(`into onError of representation-create`)
    res.status(500).json({ message: (err as Error).message })
  }
});

async function handlePost(req: MulterApiRequest, res: NextApiResponse) {
  console.log(`into representation create post`)
  const filename = req.file.filename;
  const reqId = filename.substring(0, filename.length - req.file.originalname.length);
  const representation: Prisma.RepresentationCreateInput = {
    id: reqId,
    name: req.file.originalname,
    type: req.preserved.representationType,
    usage: req.preserved.representationUsage,
    format: req.preserved.representationFormat,
    path: `${req.preserved.assetId}/${req.file.filename}`,
    fileSize: req.file.size,
    asset: {
      connect: {
        id: req.preserved.assetId
      }
    },
    uploader: {
      connect: {
        id: req.preserved.uploaderId
      }
    }
  }
  const result = await prisma.representation.create({ data: representation });
  res.status(200).json(result);
}

