
import multer from 'multer'

export const validationTypes = {
    image: ['image/png', 'image/jpeg', 'image/jif'],
    pdf: ['application/pdf'],
    video:['video/mp4']
}

export const HME = (err, req, res, next) => {
    if (err) {
        res.status(400).json({ message: "multer error", err })
    } else {
        next()
    }
}

export function myMulter(customValidation) {
    if (!customValidation) {
        customValidation = validationTypes.image
    }
    const storage = multer.diskStorage({})

    function fileFilter(req, file, cb) {
        if (customValidation.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb('In-valid Format', false)
        }
    }

    const upload = multer({fileFilter,storage })
    return upload
}