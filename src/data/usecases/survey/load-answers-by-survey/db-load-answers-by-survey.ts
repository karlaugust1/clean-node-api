import { LoadAnswersBySurvey, LoadAnswersBySurveyRepository } from "./db-load-answers-by-survey-protocols";

export class DbLoadAnswersBySurvey implements LoadAnswersBySurvey {

    constructor(
        private readonly loadSurveyByIdRepository: LoadAnswersBySurveyRepository
    ) { }

    async loadAnswers(id: string): Promise<LoadAnswersBySurvey.Result> {
        return this.loadSurveyByIdRepository.loadAnswers(id)
    }

}