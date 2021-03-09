/* eslint-disable max-len */
import { Middleware, HttpResponse } from "../../presentations/protocols";
import { Request, Response, NextFunction } from "express";

export const adaptMiddleware = (middleware: Middleware) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const request = {
        accessToken: req.headers?.["x-access-token"],
        ...(req.headers || {})
    }
    const httpResponse: HttpResponse = await middleware.handle(request)
    if (httpResponse.statusCode === 200) {
        Object.assign(req, httpResponse.body)
        next()
    } else {
        res.status(httpResponse.statusCode).json({
            error: httpResponse.body.message
        })
    }
}