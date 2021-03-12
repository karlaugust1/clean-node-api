import { CheckSurveyById, CheckSurveyByIdRepository } from "./db-check-survey-by-id-protocols";

export class DbCheckSurveyById implements CheckSurveyById {

    constructor(
        private readonly checkSurveyByIdRepository: CheckSurveyByIdRepository
    ) { }

    // eslint-disable-next-line @typescript-eslint/require-await
    async checkById(id: string): Promise<CheckSurveyById.Result> {
        return this.checkSurveyByIdRepository.checkById(id)
    }

}