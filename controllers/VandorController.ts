import { Request, Response, NextFunction } from 'express';
import { FindVandor } from './AdminController';
import { VandorLoginInputs } from '../dto';
import { ValidatePassword, GenerateSignature } from '../utility';


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


}
export const UpdateVandorProfile = async (req: Request, res: Response, next: NextFunction) => {


}
export const UpdateVandorService = async (req: Request, res: Response, next: NextFunction) => {


}