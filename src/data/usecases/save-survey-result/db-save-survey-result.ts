import { SaveSurveyResult, SaveSurveyResultModel } from "../../../domain/usecases/save-survey-result";
import { SurveyResultModel, SaveSurveyResultRepository } from "./db-save-survey-result-protocols";

export class DbSaveSurveyResult implements SaveSurveyResult {

    constructor(
        private readonly saveSurveyResultRepository: SaveSurveyResultRepository
    ) { }

    async save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
        await this.saveSurveyResultRepository.save(data)

        return null
    }

}