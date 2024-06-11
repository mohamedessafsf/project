const multer = require('multer');
const ApiError = require('../utils/apiError');



const multerOptions = () => {
        // DiskStorage engine
    // const multerStorage = multer.diskStorage({
    //     destination: function (req, file, cb) {
    //         cb(null, 'uploads/categories');
    //     },
    //     filename: function (req, file, cb) {
    //         const ext = file.mimetype.split('/')[1];
    //         console.log(ext);
    //         const filename = `category-${uuidv4()}-${Date.now()}.${ext}`;
    //         cb(null, filename);
    //     }
    // });
    
    
    // MemoryStorage engine / if the application do not need or required to use memoryStorage so better not to use it
    const memoryStorage = multer.memoryStorage();

    const multerFilter = (req, file, cb ) => {
        if(file.mimetype.startsWith('image')) {
            cb(null, true);
        } else {
            
            cb(new ApiError(`Only images are allowed`, 400), false);
        };
    };
    const upload = multer({ storage: memoryStorage, fileFilter: multerFilter});
    return upload;
};

exports.uploadMixOfImages = (arrOfFields) => multerOptions().fields(arrOfFields);

exports.uploadSingleImage = (fieldName) => multerOptions().single(fieldName);