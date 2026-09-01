import { Userservice } from "../services/user.service.js";
import { asyncErrorHandler } from "../utils/AsyncHandle.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const createUser = asyncErrorHandler(async (req, res) => {

    const user = await Userservice.createUser(req.body);
        return ApiResponse.success(
            res,
            'User created Successfuly',
            user,
            201
        );

});


export const getUser = asyncErrorHandler(async (req, res) => {
    const result = await Userservice.getUser(req.query);
    return ApiResponse.success(
        res,
        'Users fetched successfully',
        result,
        200
    );
});;