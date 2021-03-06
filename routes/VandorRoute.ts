import express, {Request, Response, NextFunction} from 'express';
import { GetVandorProfile, UpdateVandorProfile, UpdateVandorService, UpdateVandorCoverImages ,VandorLogin, AddFood, GetFoods } from '../controllers';
import { Authenticate } from '../middlewares';
import multer from 'multer';

const router = express.Router();

const imageStorage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, 'images')
    },
    filename: function (req, file, cb){
        cb(null, file.originalname)
    }
})

const images = multer({ storage: imageStorage}).array('images',10);

router.post('/login', VandorLogin);

router.use(Authenticate);
router.get('/profile', GetVandorProfile);
router.patch('/profile', UpdateVandorProfile);
router.patch('/coverImages', images, UpdateVandorCoverImages);
router.patch('/service', UpdateVandorService);


router.post('/food', images, AddFood);
router.get('/foods', GetFoods);


router.get('/',(req: Request, res: Response, next: NextFunction) =>{
    res.json({message: "Hello from Vendor"})
})


export {router as VandorRoute};