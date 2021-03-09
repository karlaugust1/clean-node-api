import { Controller, HttpResponse } from "../../presentations/protocols";
import { Request, Response } from "express";

export const adaptRoute = (controller: Controller) => async (req: Request, res: Response): Promise<void> => {
    const request = {
        ...(req.body || {}),
        ...(req.params || {}),
        accountId: req.accountId
    }
    const httpResponse: HttpResponse = await controller.handle(request)
    if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
        res.status(httpResponse.statusCode).send(httpResponse.body)
    } else {
        res.status(httpResponse.statusCode).json({
            error: httpResponse.body.message
        })
    }
}