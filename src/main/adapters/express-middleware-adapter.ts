/* eslint-disable max-len */
import { Middleware, HttpRequest, HttpResponse } from "../../presentations/protocols";
import { Request, Response, NextFunction } from "express";

export const adaptMiddleware = (middleware: Middleware) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const httpRequest: HttpRequest = {
        headers: req.headers
    }
    const httpResponse: HttpResponse = await middleware.handle(httpRequest)
    if (httpResponse.statusCode === 200) {
        Object.assign(req, httpResponse.body)
        next()
    } else {
        res.status(httpResponse.statusCode).json({
            error: httpResponse.body.message
        })
    }
}