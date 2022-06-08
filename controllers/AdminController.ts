import { Request, Response, NextFunction } from 'express';
import { CreateVandorInput } from '../dto';
import { Vandor } from '../models';
import { GenerateSalt, GeneratePassword } from '../utility'

export const FindVandor = async(id:string | undefined, email?: string)=>{
    if(email){
        return await Vandor.findOne({email: email})
    }
    else{
        return await Vandor.findById(id)
    }
}

export const CreateVandor = async (req: Request, res: Response, next: NextFunction) => {

    const {name, address, pincode, foodType, email, password,ownerName, phone} = <CreateVandorInput>req.body;

    const existingVandor = await FindVandor('',email);

    if (existingVandor !== null){
        return res.json({"massage": "A Vandor is exist with this email ID"})
    }

    //generate a salt

    const salt = await GenerateSalt()
    const userPassword = await GeneratePassword(password, salt)
    //encrypt the password using the salt
    const createdVandor = await Vandor.create({
        name: name,
        address: address,
        pincode: pincode,
        foodType: foodType,
        email: email,
        password: userPassword,
        salt: salt,
        ownerName: ownerName,
        phone: phone,
        rating: 0,
        serviceAvailible: false,
        coverImages:[],
        foods: []   
    })
    return res.json(createdVandor)
}
export const GetVandors = async (req: Request, res: Response, next: NextFunction) => {
    const vandors = await Vandor.find()

    if(vandors !== null){
        return res.json(vandors)
    }
    return res.json({"massage":"vandors data not available"})
}

export const GetVandorByID = async (req: Request, res: Response, next: NextFunction) => {
    const vandorId = req.params.id;

    const vandors = await FindVandor(vandorId);

    if(vandors !== null){
        return res.json(vandors)
    }
    return res.json({"massage":"vandors data not available"})
}