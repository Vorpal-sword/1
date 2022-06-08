import { Request, Response, NextFunction } from 'express';
import { FindVandor } from './AdminController';
import { EditVandorInputs, VandorLoginInputs, CreateFoodInputs } from '../dto';
import { ValidatePassword, GenerateSignature } from '../utility';
import { Food } from '../models';

export const VandorLogin = async (req: Request, res: Response, next: NextFunction) => {
    const {email, password} = <VandorLoginInputs>req.body;

    const existingVandor = await FindVandor('', email);

    if(existingVandor !== null){
        //validation and given access
        const validation = await ValidatePassword(password, existingVandor.password, existingVandor.salt);
        if(validation){
            const signature = GenerateSignature({
                _id: existingVandor.id,
                email: existingVandor.email,
                foodTypes: existingVandor.foodType,
                name: existingVandor.name
            })
            return res.json(signature);
        }
        else {
            return res.json({"massage":"Password is not valid"});
        }

    }
    return res.json({"massage":"Login is not valid"});
}

export const GetVandorProfile = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if(user){
        const existingVandor = await FindVandor(user._id)

        return res.json(existingVandor)
    }
    return res.json({"massage":"Vandor information not found"})

}
export const UpdateVandorProfile = async (req: Request, res: Response, next: NextFunction) => {

    const { foodTypes, name, address, phone } = <EditVandorInputs>req.body;
    const user = req.user;

    if(user){
        const existingVandor = await FindVandor(user._id)
        if(existingVandor !== null){
            existingVandor.name = name;
            existingVandor.address = address;
            existingVandor.phone = phone;
            existingVandor.foodType = foodTypes;
            
            const savedResult = await existingVandor.save()
            return res.json(savedResult);
        }   
    
        return res.json({"massage":"Vandor information not updated"})
    }
}
export const UpdateVandorCoverImages = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if(user){
        
        const vandor = await FindVandor(user._id);

        if (vandor !== null){
            const files = req.files as [Express.Multer.File]
            const images = files.map((file: Express.Multer.File) => file.filename);
            vandor.coverImages.push(...images);
            const result = await vandor.save();
            return res.json(result);
        }
    }
    return res.json({"massage":"Something went wrong with AddFood"})

}
export const UpdateVandorService = async (req: Request, res: Response, next: NextFunction) => {

    const { foodTypes, name, address, phone } = <EditVandorInputs>req.body;
    const user = req.user;

    if(user){
        const existingVandor = await FindVandor(user._id)
        if(existingVandor !== null){
           existingVandor.serviceAvailable = !existingVandor.serviceAvailable;
           const savedResult = await existingVandor.save();
           return res.json(savedResult);
        }   
    
        return res.json({"massage":"Service information not updated"})
    }

}

export const AddFood = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if(user){
        const { name, description, category, foodType, readyTime, price } = <CreateFoodInputs>req.body;
        
        const vandor = await FindVandor(user._id);

        if (vandor !== null){
            const files = req.files as [Express.Multer.File]

            const images = files.map((file: Express.Multer.File) => file.filename);

            const createdFood = await Food.create({
                vandorId: vandor._id,
                name: name,
                description: description,
                category: category,
                foodType: foodType,
                images: images,
                readyTime: readyTime,
                price: price,
                rating: 0
            })

            vandor.foods.push(createdFood);
            const result = await vandor.save();

            return res.json(result);
        }
    }
    return res.json({"massage":"Something went wrong with AddFood"})
}

export const GetFoods = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if(user){
        const foods = await Food.find({vandorId: user._id})
        if (foods !== null){
            return res.json(foods);
        }
    }
    return res.json({"massage":"Something went wrong with GetFoods"})
}