export interface SurveyResultModel {
    surveyId: string
    question: string
    answers: SurveyAnswerModel[]
    date: Date
}

interface SurveyAnswerModel {
    image?: string
    answer: string
    count: number
    percent: number
}