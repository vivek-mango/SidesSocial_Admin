import React, { useState } from 'react'
import { IconButton, TextField, Typography } from '@mui/material'
import { Video } from 'mdi-material-ui'
import themeConfig from 'src/configs/themeConfig'

const VideoUpload = ({ setVideoFile, videoPreview, setVideoPreview, videoUrl }: any) => {
    const [fileSizeError, setFileSizeError] = useState('');

    const { window } = globalThis
    const handleVideoData = (e: any) => {
        const file = e.target.files;
        const fileObject = file ? file[0] : file

        const isValidSize = fileObject.size <= 200 * 1024 * 1024; // 200 MB in bytes

        isValidSize ? setFileSizeError('') : setFileSizeError('Video file size exceeds 200 MB');

        if (fileObject) {
            const blobUrl = URL.createObjectURL(fileObject)
            setVideoPreview(blobUrl)
        }
        setVideoFile(fileObject)
    }

    const handleShowImage = () => {
        if (videoPreview) {
            window.open(videoPreview, '_blank')
        }
        else if (videoUrl) {
            window.open(`${themeConfig.graphQLEndPoint}${videoUrl}`, '_blank')
        }
    }


    return (
        <div style={{ display: 'flex' }}>
            <div style={{ flexDirection: 'column' }}>
                <Typography variant="h6" >
                    Upload Video
                </Typography>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <TextField type='file' onChange={handleVideoData} sx={{ mt: 2 }} />
                        {fileSizeError && <Typography color="error">{fileSizeError}</Typography>}
                    </div>
                    {!fileSizeError && videoPreview && (
                        <div style={{ alignContent: 'center' }}>
                            <IconButton onClick={handleShowImage} sx={{ marginLeft: 4 }}>
                                <Video color='primary' />
                            </IconButton>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default VideoUpload
