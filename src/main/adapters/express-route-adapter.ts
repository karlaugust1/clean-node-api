import { Controller, HttpRequest, HttpResponse } from "../../presentations/protocols";
import { Request, Response } from "express";

export const adaptRoute = (controller: Controller) => async (req: Request, res: Response): Promise<void> => {
    const httpRequest: HttpRequest = {
        body: req.body
    }
    const httpResponse: HttpResponse = await controller.handle(httpRequest)
    res.status(httpResponse.statusCode).send(httpResponse.body)
}