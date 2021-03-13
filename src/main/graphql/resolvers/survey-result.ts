import { adaptResolver } from "../../adapters/apollo-server-resolver-adapter"
import {
    makeLoadSurveyResultController
} from "../../factories/controllers/survey-result/load-survey-result/load-survey-result-controller-factory"
import {
    makeSaveSurveyResultController
} from "../../factories/controllers/survey-result/save-survey-result/save-survey-result-controller-factory"

/* eslint-disable */
export default {
    Query: {
        surveyResult: async (_parent: any, args: any) => adaptResolver(makeLoadSurveyResultController(), args)
    },

    Mutation: {
        saveSurveyResult: async (_parent: any, args: any) => adaptResolver(makeSaveSurveyResultController(), args)
    }
}