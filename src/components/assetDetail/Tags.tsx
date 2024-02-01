import { Box, Chip, Typography } from "@mui/material"
import { NonNullableAssetDetailOutput } from "../../libs/types"


const TagsComponent = ({ tags }: { tags: NonNullableAssetDetailOutput["tags"] }) => {
  return (
    <Box sx={{ px: 2, backgroundColor: '#333', borderTop: "solid", borderColor: "#666", borderWidth: "thin" }}>
      <Box sx={{ py: 3 }}>
        <Typography variant="h6" color="text.secondary" sx={{ fontSize: 18 }}>
          Tags
        </Typography>

        {tags.length == 0 ?
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12, textAlign: 'center' }}>No Tags Yet</Typography>
          :
          <Box sx={{
            display: 'flex',
            flexWrap: "wrap",
            p: 2,
            mt: 1,
          }}>
            {tags.map((tag, _index) => {
              return (
                <Chip
                  key={tag.id} label={tag.name}
                  onClick={() => {
                    console.log(`${tag.name} is pressed`)
                  }}
                  sx={{ m: .5, fontSize: 13 }} />
              )
            })}
          </Box>
        }

      </Box>
    </Box>
  )
}

export default TagsComponent;