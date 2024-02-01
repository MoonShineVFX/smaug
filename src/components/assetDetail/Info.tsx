import { Box, Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { NonNullableAssetDetailOutput } from "../../libs/types";


const AssetCardContent = styled(Box)(({ theme }) => ({
  backgroundColor: '#333',
  padding: theme.spacing(2),
  '&:last-child': {
    paddingBottom: theme.spacing(1),
  },
}));


const AssetInfo = ({ assetDetail }: { assetDetail: NonNullableAssetDetailOutput }) => {
  return (
    < AssetCardContent sx={{ backgroundColor: '#333', px: 2, py: 2 }
    }>
      <Typography gutterBottom={true} variant="h5" component="div" sx={{ fontWeight: 'bolder', textTransform: 'uppercase', mb: 0 }}>
        {assetDetail.name}
      </Typography>
      <Typography variant="body1" component="div" sx={{ py: 0.5, fontWeight: 'bolder', textTransform: 'uppercase', mb: 0, minHeight: '1em', }}>
        {assetDetail.description === "" ? " " : assetDetail.description}
      </Typography>
      <Grid container justifyContent="space-between">
        <Grid item>
          <Typography variant="body2" color="text.secondary" sx={{ textTransform: '', letterSpacing: '', fontSize: 13 }}>
            {assetDetail.categoryList?.replace(/\\/g, " > ").slice(0, -2)}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12, textAlign: 'right' }}>
            Created at {assetDetail.createAt?.toLocaleString().substr(0, 10)} by {assetDetail.creator}
          </Typography>
        </Grid>
      </Grid>
    </AssetCardContent >
  )
}

export default AssetInfo;