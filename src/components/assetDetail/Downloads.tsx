import { Box, IconButton, Typography } from "@mui/material";
import { NonNullableAssetDetailOutput } from "../../libs/types";
import { RepresentationFormat } from "@prisma/client";
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';


const DownloadComponent = ({ downloads }: { downloads: NonNullableAssetDetailOutput["representations"] }) => {
  const formatNames: { [key in RepresentationFormat]: string } = {
    [RepresentationFormat.MAX]: "3ds Max",
    [RepresentationFormat.MB]: "Maya",
    [RepresentationFormat.FBX]: "FBX",
    [RepresentationFormat.OBJ]: "OBJ",
    [RepresentationFormat.C4D]: "Cinema 4D",
    [RepresentationFormat.UNREAL]: "Unreal Engine Asset",
    [RepresentationFormat.UNITY]: "Unity Package",
    [RepresentationFormat.USD]: "USD",
    [RepresentationFormat.IMG]: "Image",
    [RepresentationFormat.GLB]: "GLB",
  };

  return (
    <Box sx={{ px: 2 }}>
      <Box sx={{ pt: 3 }}>
        <Typography variant="h5" color="text.primary" >
          Download
        </Typography>
        <Box>
          {
            downloads.length === 0 ?
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                  No Downloadable File Now
                </Typography>
              </Box>
              :
              downloads.map((download, _) => (
                <Box key={download.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, borderBottom: "solid", borderWidth: "1px", borderColor: "#ccc" }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                    {`${formatNames[download.format!]} ${download.filesize}`}
                  </Typography>
                  <IconButton
                    aria-label="download"
                    size="large"
                    sx={{ fontSize: 16, borderRadius: "6%", marginBottom: 1, p: 1 }}
                    href={download.path}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    下載
                    <ArrowCircleDownIcon fontSize="large" sx={{ marginLeft: 1 }} />
                  </IconButton>
                </Box>
              ))
          }
        </Box>
      </Box>
    </Box>
  )
}

export default DownloadComponent;