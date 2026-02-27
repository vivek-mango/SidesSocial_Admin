import React, { useState } from 'react'
import { TextField, Button, IconButton, Typography } from '@mui/material'
import { ImageSearch } from 'mdi-material-ui'
import themeConfig from 'src/configs/themeConfig'

const ImageUpload = ({ setImageFile, imagePreview, setImagePreview, imageUrl }: any) => {
    const { window } = globalThis
    const handleImageData = (e: any) => {
        const fileObject = e.target.files ? e.target.files[0] : e.target.file
        if (fileObject) {
            const blobUrl = URL.createObjectURL(fileObject)
            setImagePreview(blobUrl)
        }
        setImageFile(fileObject)
    }

    const handleShowImage = () => {
        if (imagePreview) {
            window.open(imagePreview, '_blank')
        } else if (imageUrl) {
            window.open(`${themeConfig.graphQLEndPoint}${imageUrl}`, '_blank')
        }
    }

    return (
        <div style={{ display: 'flex' }}>
            <div style={{ flexDirection: 'column' }}>
                <Typography variant="h6" >
                    Upload Image
                </Typography>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <TextField type='file' onChange={handleImageData} sx={{ mt: 2 }} />
                    {imagePreview && (
                        <div style={{ alignContent: 'center' }}>
                            <IconButton onClick={handleShowImage} sx={{ marginLeft: 4 }}>
                                <ImageSearch color='primary' />
                            </IconButton>
                        </div>
                    )}
                </div>
            </div>

        </div>
    )
}

export default ImageUpload
