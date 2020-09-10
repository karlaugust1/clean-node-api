import {
    accountSchema, loginParamsSchema, errorSchema, surveyAnswerSchema, surveySchema, surveysSchema,
    signupParamsSchema, addSurveyParamsSchema, saveSurveyParamsSchema, surveyResultSchema
} from "./schemas/"

export default {
    account: accountSchema,
    loginParams: loginParamsSchema,
    signupParams: signupParamsSchema,
    error: errorSchema,
    surveyAnswer: surveyAnswerSchema,
    survey: surveySchema,
    surveys: surveysSchema,
    addSurveyParams: addSurveyParamsSchema,
    saveSurveyParams: saveSurveyParamsSchema,
    surveyResult: surveyResultSchema
}